const express = require('express');
const auth = require('../../middlewares/auth');

const { botController } = require('../../controllers');

const router = express.Router();

router.post('/generate', auth(), botController.train);
router.post('/create', auth(), botController.createProject);
router.get('/projects', auth(), botController.getProjects);

module.exports = router;
