const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);
router.get('/logout', UserController.logoutUser);
router.post('/buy-membership', UserController.buyMembership);
router.post('/editUser', UserController.editUserDashboard);
router.post('/changePassword', UserController.changePasswordDashboard);
router.get('/create', UserController.renderCreateUserPage);
router.post('/create', UserController.createUser);
router.delete('/delete/:id', UserController.deleteUser);
router.get('/edit/:id', UserController.renderEditUserPage);
router.post('/edit/:id', UserController.updateUser);

module.exports = router;