const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const { authService, userService, tokenService, emailService, stripeService } = require('../services');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

const register = catchAsync(async (req, res) => {
  const customer = await stripeService.createCustomer({
    name: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email,
  });
  const user = await userService.createUser({ ...req.body, stripeCustomer: customer });
  // const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  console.log(req.body, resetPasswordToken);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const googleSignUp = catchAsync(async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  console.log(tokens);
  console.log(userInfo.data);
  const user  = await userService.getUserByEmail(userInfo.data.email);
  if(!user){

    const customer = await stripeService.createCustomer({
      name: `${userInfo.given_name} ${userInfo.family_name}`,
      email: userInfo.email,
    });

    await userService.createUser({ provider: "Google", password: uuidv4() ,firstName: userInfo.data.given_name, lastName: userInfo.data.family_name , email: userInfo.data.email, stripeCustomer: customer, chatBotId: uuidv4() });

    res.json({status: true, userInfo: userInfo.data});
  } else {

    res.json({status: false, message: "User already exist"});
  }

});

const googleLogin = catchAsync( async (req, res) => {
  const { code } = req.body;
  const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${code}` },
  });
  const user = await userService.getUserByEmail(userInfo.data.email);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
})

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  googleSignUp,
  googleLogin,
};
