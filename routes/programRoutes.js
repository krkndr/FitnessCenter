const express = require('express');
const router = express.Router();
const ProgramController = require('../controllers/programController');

router.get('/', ProgramController.renderProgramsPage);
router.get('/create', ProgramController.renderCreateProgramPage);
router.post('/create', ProgramController.createProgram);
router.delete('/delete/:id', ProgramController.deleteProgram);
router.get('/edit/:id', ProgramController.renderEditProgramPage);
router.post('/edit/:id', ProgramController.updateProgram);

module.exports = router;