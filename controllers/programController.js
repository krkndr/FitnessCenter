const ProgramService = require("../services/programService");
const TrainingService = require("../services/trainingService");

const ProgramController = {

    renderCreateProgramPage: async (req, res) => {
        try {
            res.render('admin/create/create-program');
        } catch (err) {
            console.error('Помилка відкриття форми створення програми:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    createProgram: async (req, res) => {
        try {
            const programData = req.body;
            await ProgramService.createProgram(programData);
            res.status(200).json({success: true});
        } catch (err) {
            console.error('Помилка створення програми:', err);
            res.status(400).json({success: false, message: err.message});
        }
    },

    deleteProgram: async (req, res) => {
        try {
            const { id } = req.params;
            const hasTrainingsWithProgram = await TrainingService.checkProgramHasTrainings(id);
            if (hasTrainingsWithProgram) {
                return res.status(400).json({
                    success: false,
                    message: 'Цю програму не можна видалити, оскільки є тренування, пов\'язані з цією програмою.'
                });
            }
            await ProgramService.deleteProgram(id);
            res.json({ success: true, message: 'Програму успішно видалено.' });
        } catch (error) {
            console.error('Помилка видалення програми:', error);
            res.status(500).json({ success: false, message: 'Не вдалося видалити програму.' });
        }
    },

    renderEditProgramPage: async (req, res) => {
        const programId = req.params.id;
        try {
            const program = await ProgramService.getProgramById(programId);
            res.render('admin/edit/edit-program', { program });
        } catch (err) {
            console.error('Помилка відкриття сторінки деталей тренування:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    updateProgram: async (req, res) => {
        const programId = req.params.id;
        const updatedData = req.body;
        try {
            await ProgramService.updateProgram(programId, updatedData);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Помилка оновлення даних рограми:', err);
            res.status(400).json({ success: false, message: err.message });
        }
    },

    renderProgramsPage: async (req, res) => {
        try {
            const programs = await ProgramService.getAllPrograms();
            res.render('programs', { programs });
        } catch (err) {
            console.error(err);
            res.status(500).send('Помилка серверу при отриманні програм');
        }
    },
};

module.exports = ProgramController;
