const express = require('express');
const router = express.Router();
const TrainingController = require('../controllers/trainingController');

router.get('/create', TrainingController.renderCreateTrainingPage);
router.post('/create', TrainingController.createTraining);
router.delete('/delete/:id', TrainingController.deleteTraining);
router.get('/edit/:id', TrainingController.renderEditTrainingPage);
router.post('/edit/:id', TrainingController.updateTraining);

module.exports = router;
