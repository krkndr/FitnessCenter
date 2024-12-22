const TrainingService = require('../services/trainingService');
const ProgramService = require('../services/programService');
const TrainerService = require('../services/trainerService');
const TrainingUserService = require('../services/trainingUserService');
const UserService = require("../services/userService");
const getWeekDates = require('../utils/getWeekDates');

const TrainingController = {

    groupTrainingsByTrainer: (trainings) => {
        const grouped = {};
        trainings.forEach((training) => {
            const trainerName = training.trainer_name;
            const formattedTime = training.time.slice(0, 5);

            if (!grouped[trainerName]) {
                grouped[trainerName] = [];
            }
            grouped[trainerName].push({
                ...training,
                formattedTime,
            });
        });

        return Object.keys(grouped).map((trainer) => ({
            trainer_name: trainer,
            trainings: grouped[trainer],
        }));
    },

    renderTrainingPage: async (req, res) => {
        try {

            const userId = req.session.user?.id;
            const membership = await UserService.getUserMembership(userId);

            const { program_id, date } = req.query;
            console.log(program_id);
            console.log(date);
            const programs = await ProgramService.getAllPrograms();

            const trainings = await TrainingService.getFilteredTrainings(program_id, date);
            console.log(trainings);
            const trainingsGroupedByTrainer = TrainingController.groupTrainingsByTrainer(trainings);
            console.log(trainingsGroupedByTrainer);
            res.render('dashboard/sing-up-training', {
                trainings,
                programs,
                program_id,
                date,
                trainingsGroupedByTrainer,
                membership: membership || null,
            });

        } catch (err) {
            console.error('Помилка відтворення сторінки тренувань:', err);
            res.status(500).send('Помилка під час отримання тренувань');
        }
    },

    registerForTraining: async (req, res) => {
        try {
            const { training_id } = req.body;
            const user_id = req.session.user?.id;
            if (!training_id || !user_id) {
                return res.status(400).json({ success: false, error: 'Щоб записатись, виберіть час!' });
            }
            const existingRegistration = await TrainingUserService.checkExistingRegistration(training_id, user_id);
            if (existingRegistration) {
                return res.status(400).json({ success: false, error: 'Ви уже записані на це тренування!' });
            }
            await TrainingUserService.create(training_id, user_id, 'registered');
            await TrainingService.decrementQuantity(training_id);
            res.json({ success: true, message: 'Реєстрація успішна. Чекаємо Вас на тренуванні!' });
        } catch (err) {
            console.error('Помилка реєстрації на тренування:', err);
            res.status(500).json({ success: false, error: 'Помилка реєстрації на тренування.' });
        }
    },

    renderSchedulePage: async (req, res) => {
        try {
            const currentDate = new Date();
            const { direction } = req.query;
            const { weekDates, startOfWeekFormatted, endOfWeekFormatted } = await getWeekDates(currentDate, direction || 'current');
            const canGoNext = direction !== 'next';
            const canGoBack = direction === 'next';

            weekDates.forEach(weekDay => {
                const [day, month, year] = weekDay.date.split('.');
                const dayDate = new Date(`${year}-${month}-${day}`);

                weekDay.isToday = dayDate.toDateString() === currentDate.toDateString();
                weekDay.isPast = dayDate < currentDate && !weekDay.isToday;

                if (!isNaN(dayDate.getTime())) {
                    const options = { day: 'numeric', month: 'long' };
                    weekDay.date = dayDate.toLocaleDateString('uk-UA', options);
                } else {
                    console.error('Invalid date:', weekDay.date);
                    weekDay.date = 'Невірна дата';
                }
            });

            const scheduleTable = [];

            for (let hour = 10; hour <= 19; hour++) {
                const hourRow = [];
                for (const weekDay of weekDates) {
                    const trainingsAtHour = weekDay.trainings.filter(training => {
                        const trainingHour = training.time.slice(0, 2);
                        return trainingHour === String(hour).padStart(2, '0');
                    });
                    hourRow.push(trainingsAtHour);
                }
                scheduleTable.push(hourRow);
            }

            weekDates.forEach(weekDay => {
                weekDay.trainings.forEach(training => {
                    training.formattedTime = training.time.slice(0, 5);
                });
            });

            res.render('schedule', {
                scheduleTable,
                startOfWeekFormatted,
                endOfWeekFormatted,
                weekDates,
                currentDate,
                canGoBack,
                canGoNext,
            });
        } catch (error) {
            console.error('Помилка при отриманні даних для розкладу:', error);
            res.status(500).send('Сталася помилка при завантаженні розкладу');
        }
    },

    renderCreateTrainingPage: async (req, res) => {
        try {
            const programs = await ProgramService.getAllPrograms();
            const trainers = await TrainerService.getAllTrainers();
            res.render('admin/create/create-training', { programs, trainers });
        } catch (err) {
            console.error('Помилка відкриття форми створення тренування:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    createTraining: async (req, res) => {
        try {
            const trainingData = req.body;
            await TrainingService.createTraining(trainingData);
            res.status(200).json({success: true});
        } catch (err) {
            console.error('Помилка створення тренування:', err);
            res.status(400).json({success: false, message: err.message});
        }
    },

    deleteTraining: async (req, res) => {
        try {
            const { id } = req.params;
            const hasRegistrations = await TrainingUserService.hasRegistrations(id);
            if (hasRegistrations) {
                return res.status(400).json({
                    success: false,
                    message: 'Неможливо видалити тренування, оскільки є активні записи на нього.',
                });
            }
            await TrainingService.deleteTraining(id);
            res.json({ success: true, message: 'Тренування успішно видалено.' });
        } catch (error) {
            console.error('Помилка видалення тренування:', error);
            res.status(500).json({ success: false, message: 'Не вдалося видалити тренування.' });
        }
    },

    renderEditTrainingPage: async (req, res) => {
        const trainingId = req.params.id;
        try {
            const training = await TrainingService.getTrainingById(trainingId);
            const programs = await ProgramService.getAllPrograms();
            const trainers = await TrainerService.getAllTrainers();
            const singleTraining = training[0];
            const formattedDate = singleTraining.date.toISOString().split('T')[0];
            res.render('admin/edit/edit-training', { training: { ...singleTraining, date: formattedDate }, programs, trainers });
        } catch (err) {
            console.error('Помилка відкриття сторінки деталей тренування:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    updateTraining: async (req, res) => {
        const trainingId = req.params.id;
        const updatedData = req.body;
        try {
            await TrainingService.updateTraining(trainingId, updatedData);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Помилка оновлення тренування:', err);
            res.status(400).json({ success: false, message: err.message });
        }
    },
};

module.exports = TrainingController;
