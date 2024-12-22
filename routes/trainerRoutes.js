const express = require('express');
const router = express.Router();
const TrainerController = require('../controllers/trainerController');

router.get('/', TrainerController.renderTrainersPage);
router.get('/create', TrainerController.renderCreateTrainerPage);
router.post('/create', TrainerController.createTrainer);
router.delete('/delete/:id', TrainerController.deleteTrainer);
router.get('/edit/:id', TrainerController.renderEditTrainerPage);
router.post('/edit/:id', TrainerController.updateTrainer);

module.exports = router;