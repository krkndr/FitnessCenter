const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

router.get('/', AdminController.index);
router.get('/adminpanel-trainings', AdminController.renderAdminTrainingsPage);
router.get('/adminpanel-users', AdminController.renderAdminUsersPage);
router.get('/adminpanel-trainers', AdminController.renderAdminTrainersPage);
router.get('/adminpanel-programs', AdminController.renderAdminProgramsPage);
router.get('/adminpanel-memberships', AdminController.renderAdminMembershipsPage);

module.exports = router;