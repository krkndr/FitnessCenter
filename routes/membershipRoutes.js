const express = require('express');
const router = express.Router();
const MembershipController = require('../controllers/membershipController');

router.get('/', MembershipController.renderMembershipsPage);
router.get('/create', MembershipController.renderCreateMembershipPage);
router.post('/create', MembershipController.createMembership);
router.delete('/delete/:id', MembershipController.deleteMembership);
router.get('/edit/:id', MembershipController.renderEditMembershipPage);
router.post('/edit/:id', MembershipController.updateMembership);

module.exports = router;