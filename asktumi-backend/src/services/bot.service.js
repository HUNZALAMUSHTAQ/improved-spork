const mongoose = require('mongoose');
const { scrapeWebsites } = require('../../components/scrapeSites');
const { getRelevantChunksFromPinecone } = require('../../components/getMatchingChunks');
const { getTranslation } = require('../../components/translateSite');
const { getSummary } = require('../../components/summarizeSite');
const { getAiRecommendation } = require('../../components/getAiRecommendations');
const WorkSpace = require('../models/workspace.model');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

async function saveWorkSpace(obj) {
  return WorkSpace.create(obj);
}

async function createWorkSpace(reqObj) {
  const { query, totalResults, userID } = reqObj;
  const matchingChunks = await getRelevantChunksFromPinecone({
    query, // User's query to run a matching query against
    fetchTopK: totalResults, // The number of matching chunks to retrieve from Pinecone
  });

  /*
  ========================
  FORMAT OF matchingChunks
  ========================
  [
    [
      {
        "pageContent": "322novies CP...",
        "metadata": {
          "id": "http://relevancy.bger.ch/cgi-bin/JumpCGI?id=14.04.2023_6B_280/2022",
          "verdict_date": "14.04.2023",
          "verdict_id": "6B_280/2022\n"
        }
      },
      0.774409711
    ],
    [
      {
        "pageContent": "Es gilt damit...",
        "metadata": {
          "id": "http://relevancy.bger.ch/cgi-bin/JumpCGI?id=05.05.2023_2C_393/2022",
          "verdict_date": "05.05.2023",
          "verdict_id": "2C_393/2022\n"
        }
      },
      0.773888052 
    ]
  ] */

  const matchingChunksForAiContext = matchingChunks.reduce((accumulator, chunk) => {
    accumulator += `--------------------------------------------\n${chunk[0].pageContent}`;
    return accumulator;
  }, '');

  const aiRecommendationPromise = getAiRecommendation(query, matchingChunksForAiContext);

  const scrapedSitesContentPromises = matchingChunks.map((chunk, index) => {
    chunk[0].metadata.similarityScore = parseFloat(chunk[1]) * 100;
    // console.log(JSON.stringify(chunk, null, 2));
    console.log(`Scraping ${chunk[0].metadata.id}...`);
    return scrapeWebsites({ chunk: chunk[0] });
  });

  let scrapedSitesContent = await Promise.all(scrapedSitesContentPromises.concat(aiRecommendationPromise));

  const aiRecommendationObj = scrapedSitesContent.reduce((accumulator, obj) => {
    if (Object.keys(obj).includes('aiRecommendation')) {
      scrapedSitesContent = scrapedSitesContent.filter((obj) => !obj.hasOwnProperty('aiRecommendation'));
      return (accumulator.aiRecommendation = obj.aiRecommendation);
    }
    return accumulator;
  }, {});

  /*  
  =============================
  FORMAT OF scrapedSitesContent
  =============================
  [
      {
        "verdictDate": "14.04.2023",
        "verdictId": "6B_280/2022\n",
        "pageContent": "322novies CP visait à détacher...",
        "similarityScore":55.22,
        "url": "http://relevancy.bger.ch/cgi-bin/JumpCGI?id=14.04.2023_6B_280/2022",
        "scrapedArticleFromUrl": "\nBundesgericht..."
      },
      {
        "verdictDate": "05.05.2023",
        "verdictId": "2C_393/2022\n",
        "pageContent": "Es gilt damit der Grundsatz...",
        "similarityScore":45.66,
        "url": "http://relevancy.bger.ch/cgi-bin/JumpCGI?id=05.05.2023_2C_393/2022",
        "scrapedArticleFromUrl": "\nBundesgericht..." 
      }
  ]
  */

  // const summarizedContent = await getSummary({
  //   docText:scrapedSitesContent[0].scrapedArticleFromUrl
  // })

  // const translatedContent = await getTranslation(
  //   {docText: scrapedSitesContent[0].scrapedArticleFromUrl,
  //   targetLang: String("English")}
  // );
  console.log("aiRecommendationObj", aiRecommendationObj)
  const workSpace = await saveWorkSpace({
    ...reqObj,
    aiRecommendation: aiRecommendationObj,
    results: scrapedSitesContent,
    isFavourite: false,
    createdAt: new Date(),
    name: '',
    userID,
  });
  return workSpace;
}

async function getSummarizeContent(article, workSpaceId, creditUsed) {
  const summarizedContent = await getSummary({
    docText: article,
  });
  await WorkSpace.updateOne(
    {
      _id: workSpaceId,
    },
    {
      summarizedContent,
    }
  );
  return { data: summarizedContent };
}

async function getTranslateContent(article, language, workSpaceId, creditUsed) {
  const translatedContent = await getTranslation({
    docText: article,
    targetLang: String(language),
  });
  await WorkSpace.updateOne(
    {
      _id: workSpaceId,
    },
    {
      [language] : translatedContent,
    }
  );
  return { data: translatedContent };
}

// getWorkSpace({
//   query:
//     "I was defending myself, when suddenly the person who was trying to kill me, fired the gun, and accidently killed himself. What should I do in this case?",
// });

async function saveAsFavourite(workSpaceId, name){
  const id = mongoose.Types.ObjectId(workSpaceId)
  const workspace = await WorkSpace.findById(id);
  if (!workspace) {
    throw new ApiError(404, 'workspace does not exist against this ID');
  }

  workspace.name = name;
  workspace.isFavourite = true;
  await workspace.save();
}

async function checkTokenExist(userId, totalTokenUse) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'user does not exist against this ID');
  }

  if (user.tokens >= totalTokenUse) {
  } else {
    throw new ApiError(403, 'You dont have enough token to complete this request');
  }
}

async function decreaseToken(userId, token) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'user does not exist against this ID');
  }

  user.tokens -= token;
  await user.save();
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getWorkSpaces = async (filter, options) => {
  const workspaces = await WorkSpace.paginate(filter, options);
  return workspaces;
};

const deleteWorkSpace = async (workSpaceId) => {
  const id = mongoose.Types.ObjectId(workSpaceId)
  return WorkSpace.deleteOne({
    _id: id,
  })
}

const removeFromFavourite = async (workSpaceId) => {
  const id = mongoose.Types.ObjectId(workSpaceId)
  return WorkSpace.updateOne({
    _id: id,
  }, {
    isFavourite: false,
    name: null,
  })
}

module.exports.createWorkSpace = createWorkSpace;
module.exports.getSummarizeContent = getSummarizeContent;
module.exports.getTranslateContent = getTranslateContent;
module.exports.checkTokenExist = checkTokenExist;
module.exports.decreaseToken = decreaseToken;
module.exports.saveAsFavourite = saveAsFavourite;
module.exports.getWorkSpaces = getWorkSpaces;
module.exports.deleteWorkSpace = deleteWorkSpace;
module.exports.removeFromFavourite = removeFromFavourite;
