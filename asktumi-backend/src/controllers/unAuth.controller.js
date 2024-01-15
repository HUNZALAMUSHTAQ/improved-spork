const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { projectService } = require('../services');
const { transactionService } = require('../services');

const queryBot = catchAsync(async (req, res) => {
  const { chatflowid } = req.params;
  const { history, question } = req.body;
  const project = await projectService.getProject({ chatBotId: chatflowid });
  const user = await userService.getUserById(project?.userId);

  const data = {
    chatId: chatflowid,
    history,
    question,
  };
  axios({
    method: 'post',
    url: `${process.env.CHATBOT_URL}chat`,
    data: data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      console.log('Response:', response?.data);
      if (user?.tokens < response?.data?.totalTokens) {
        res.send('Oops, not enough token to process this request');
      } else {
        let updatedTokens = user?.tokens - response?.data?.totalTokens;
        await transactionService.createTransaction({
          ...chatId,
          remainingTokens: Number(updatedTokens),
          tokensUsed: Number(response?.data?.totalTokens),
        });
        console.log(updatedTokens, 'updatedTokens');
        await userService.updateUserById(user._id, {
          tokens: Number(updatedTokens),
        });
        res.send(response?.data?.response);
      }
    })
    .catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message);
    });
});

module.exports = {
  queryBot,
};
