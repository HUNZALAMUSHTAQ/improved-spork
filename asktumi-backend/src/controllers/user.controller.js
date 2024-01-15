const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Import the uuid package
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, stripeService } = require('../services');
const { generateToken } = require('../services/token.service');
const { sendEmail, sendSetPasswordEmail } = require('../services/email.service');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

const moment = require('moment');
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body, 'updateUser');
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getSignedUrlForUploadFile = catchAsync(async (req, res) => {
  const { fileType } = req.query;

  // Generate a random UID for the file name
  const fileName = `${uuidv4()}.${fileType.split('/').pop()}`;

  console.log(fileName, fileType);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    Expires: 180, // URL expiration time in seconds
  };

  // Generate the pre-signed URL
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.error('Error generating pre-signed URL:', err);
      res.status(500).json({ error: 'Failed to generate pre-signed URL' });
    } else {
      res.json({ url });
    }
  });
});

const createUserByCompany = catchAsync(async (req, res) => {
  const { email, firstName, lastName } = req.body;

  const company = req.user;
  if (company.accountType != 'company') {
    return res.status(401).json({ message: 'Un Authorized to create user' });
  }
  const companyId = company._id;
  console.log(companyId, 'acdsad');
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists.' });
  }

  const expires = moment().add(30, 'day');
  const token = generateToken(email, expires, 'account_creation');


  const customer = await stripeService.createCustomer({
    name: `${firstName} ${lastName}`,
    email: email,
  });
  const user = await userService.createUser({
    email: email,
    role: 'user',
    companyId: companyId,
    accountType: 'user',
    firstName: firstName,
    lastName: lastName,
    isEmailVerified: false,
    stripeCustomer: customer,
    password: 'Abc12345',
  });
  await sendSetPasswordEmail(email, token);

  res.status(201).json({ message: 'Token sent and User created successfully.', user });
});

const setPasswordUserByCompany = catchAsync(async (req, res) => {
  const { email, password, token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'No token exists' });
  }
  const decodedToken = jwt.verify(token, config.jwt.secret);

  const user = await User.findOne({ email: decodedToken.sub });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // const hashedPassword = await bcrypt.hash(password, 8);

  user.password = password;
  user.isEmailVerified = true;
  await user.save();

  res.status(200).json({ message: 'Password set successfully.' });
});

const getAllCompanyUsers = catchAsync(async (req, res) => {
  const company = req.user;
  if (company.accountType != 'company') {
    return res.status(401).json({ message: 'Un Authorized to create user' });
  }
  const companyId = req.user.id;
  const allUsers = await User.find({companyId : companyId})
  res.status(200).json(allUsers);
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getSignedUrlForUploadFile,
  setPasswordUserByCompany,
  createUserByCompany,
  getAllCompanyUsers
};
