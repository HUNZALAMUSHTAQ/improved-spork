/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const train = catchAsync(async (req, res) => {
  const { action } = req.query;
  const { chatBotId, url } = req.body;
  // if (action === 'file') {
  //   // download the file via aws s3 here
  //   let fileKey = new URL(url).pathname.substring(1);
  //   console.log('Trying to download file', fileKey);
  //   let AWS = require('aws-sdk');
  //   AWS.config.update({
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //     region: process.env.AWS_REGION,
  //   });
  //   let s3 = new AWS.S3();
  //   const localDirectory = './temp/';

  //   if (!fs.existsSync(localDirectory)) {
  //     fs.mkdirSync(localDirectory);
  //   }
  //   let options = {
  //     Bucket: process.env.BUCKET_NAME,
  //     Key: fileKey,
  //   };
  //   const localFilePath = path.join(localDirectory, path.basename(fileKey));

  //   // Create a readable stream to save the file locally
  //   const fileStream = fs.createWriteStream(localFilePath);
  //   // const fileStream2 = s3.getObject(options).createReadStream(); // Change to the path of the file you want to send

  //   s3.getObject(options)
  //     .createReadStream()
  //     .pipe(fileStream)
  //     .on('error', (err) => {
  //       console.error('Error downloading file from S3:', err);
  //     })
  //     .on('close', () => {
  //       console.log(`File downloaded to ${localFilePath}`, path.basename(fileKey));
  //       const fileStream = fs.createReadStream(`./temp/${path.basename(fileKey)}`);
  //       const form = new FormData();
  //       form.append('file', fileStream, {
  //         filename: path.basename(fileKey),
  //       });

  //       axios({
  //         method: 'post',
  //         url: `${process.env.CHATBOT_URL}/upload/${req.user.chatBotId}`,
  //         data: form,
  //         headers: {
  //           ...form.getHeaders(),
  //         },
  //       })
  //         .then((response) => {
  //           console.log('response', response.data);
  //           console.log('File sent to Flask successfully');
  //           res.send({});
  //         })
  //         .catch((error) => {
  //           console.error('Error sending the file to Flask:', error);
  //           res.send({});
  //         });
  //     });
  // }
  if (action === 'file') {
    const data = {
      s3objectUrl: `https://asktumi.s3.ap-southeast-2.amazonaws.com/${new URL(url).pathname.substring(1)}`,
      workspaceId: chatBotId,
    };
    console.log(data, 'data----------->');
    axios({
      method: 'post',
      url: `${process.env.CHATBOT_URL}update-knowledgebase`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('response', response.data);
        res.send(response.data);
      })
      .catch((error) => {
        console.error('err', error);
        res.send('err');
      });
  }
});

const createProject = catchAsync(async (req, res) => {
  try {
    const user = req.user?.company ? req.user?.company?._id : req?.user?._id;
    const project = await projectService.createProject({ ...(req.body || {}), chatBotId: uuidv4(), userId: user });
    res.send({ status: true, data: project });
  } catch (e) {
    res.send({ status: false, data: null, error: e, message: e.message || 'Error on creating a project' });
  }
});

const getProjects = catchAsync(async (req, res) => {
  try {
    const user = req.user?.company ? req.user?.company?._id : req?.user?._id;
    const filter = pick(req.query, ['userId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const projects = await projectService.getProjects({ userId: user }, options);
    res.send({ status: true, data: projects });
  } catch (e) {
    res.send({ status: false, data: null, error: e, message: e.message || 'Error on creating a project' });
  }
});

module.exports = {
  train,
  createProject,
  getProjects,
};
