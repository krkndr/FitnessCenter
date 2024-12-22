const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const UserController = require('../controllers/UserController.js');
const trainingController = require('../controllers/trainingController');

router.get('/', DashboardController.renderDashboard);
router.get('/my-trainings', UserController.renderMyTrainings);
router.post('/cancel-training', UserController.cancelTraining);
router.get('/sing-up-training', trainingController.renderTrainingPage);
router.post('/sing-up-training/register-training', trainingController.registerForTraining);

module.exports = router;
