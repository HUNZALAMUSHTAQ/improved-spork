const express = require('express');

const { unAuthController } = require('../../controllers');

const router = express.Router();

router.post('/bot/:chatflowid', unAuthController.queryBot);

module.exports = router;
