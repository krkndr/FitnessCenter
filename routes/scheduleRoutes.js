const express = require('express');
const router = express.Router();
const TrainingController = require('../controllers/trainingController');

router.get('/', TrainingController.renderSchedulePage);

module.exports = router;
