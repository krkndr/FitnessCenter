const TrainerService = require('../services/TrainerService.js');
const TrainingService = require('../services/TrainingService.js');
const { formatToDDMMYYYY, formatToYYYYMMDD } = require('../utils/dateFormatter');
const ProgramService = require("../services/programService");

const TrainerController = {

    renderCreateTrainerPage: async (req, res) => {
        try {
            const programs = await ProgramService.getAllPrograms();
            res.render('admin/create/create-trainer', { programs });
        } catch (err) {
            console.error('Помилка відкриття форми створення тренера:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    createTrainer: async (req, res) => {
        const trainerData = req.body;

        try {
            await TrainerService.createTrainer(trainerData);
            res.status(200).json({success: true});
        } catch (err) {
            console.error('Помилка створення тренера:', err);
            res.status(400).json({success: false, message: err.message});
        }
    },

    deleteTrainer: async (req, res) => {
        try {
            const { id } = req.params;
            const hasPlannedTrainings = await TrainingService.checkTrainerAssignedToPlannedTrainings(id);
            if (hasPlannedTrainings) {
                return res.status(400).json({
                    success: false,
                    message: 'Цього тренера не можна видалити, оскільки він прив\'язаний до запланованих тренувань.'
                });
            }
            await TrainingService.updateTrainingsWithDeletedTrainer(id);
            await TrainerService.deleteTrainer(id);
            res.json({ success: true, message: 'Тренера успішно видалено, тренування оновлено.' });
        } catch (error) {
            console.error('Помилка видалення тренера:', error);
            res.status(500).json({ success: false, message: 'Не вдалося видалити тренера.' });
        }
    },

    renderEditTrainerPage: async (req, res) => {
        const trainerId = req.params.id;
        try {
            const trainer = await TrainerService.getTrainerById(trainerId);
            const programs = await ProgramService.getAllPrograms();

            if (!trainer) {
                return res.status(404).send('Тренер не знайдений.');
            }
            trainer.date_of_birth = formatToYYYYMMDD(trainer.date_of_birth);
            trainer.date_of_employment = formatToYYYYMMDD(trainer.date_of_employment);
            res.render('admin/edit/edit-trainer', {trainer, programs});
        } catch (err) {
            console.error('Помилка відкриття сторінки редагування тренера:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    updateTrainer: async (req, res) => {
        const trainerId = req.params.id;
        const updatedData = req.body;
        try {
            await TrainerService.updateTrainer(trainerId, updatedData);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Помилка оновлення даних тренера:', err);
            res.status(400).json({ success: false, message: err.message });
        }
    },

    renderTrainersPage: async (req, res) => {
        try {
            const trainers = await TrainerService.getAllTrainers();
            res.render('trainers', { trainers });
        } catch (err) {
            console.error(err);
            res.status(500).send('Помилка серверу при отриманні тренерів');
        }
    },
};

module.exports = TrainerController;
