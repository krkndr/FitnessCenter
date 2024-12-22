const MembershipService = require("../services/MembershipService");
const ProgramService = require("../services/programService");
const TrainerService = require("../services/trainerService");
const {formatToDDMMYYYY} = require("../utils/dateFormatter");
const TrainingService = require("../services/trainingService");
const formatTrainings = require("../utils/formatTrainings");
const sortTrainings = require("../utils/sortTrainings");
const UserService = require("../services/userService");
const processUsers = require("../utils/formatUsers");

const AdminController = {

    index: (req, res) => {
        const user = req.session.user;
        res.render('admin/adminpanel', { user });
    },

    renderAdminMembershipsPage: async (req, res) => {
        try {
            let memberships = await MembershipService.getAllMemberships();
            res.render('admin/adminpanel-memberships', { memberships });
        } catch (err) {
            console.error('Помилка отримання абонементів для adminpanel:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    renderAdminProgramsPage: async (req, res) => {
        try {
            let programs = await ProgramService.getAllPrograms();
            res.render('admin/adminpanel-programs', { programs });
        } catch (err) {
            console.error('Помилка отримання програм для adminpanel:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    renderAdminTrainersPage: async (req, res) => {
        try {
            let trainers = await TrainerService.getAllTrainers();

            trainers = trainers.map(trainer => ({
                ...trainer,
                date_of_birth: formatToDDMMYYYY(trainer.date_of_birth),
                date_of_employment: formatToDDMMYYYY(trainer.date_of_employment),
            }));

            res.render('admin/adminpanel-trainers', { trainers });
        } catch (err) {
            console.error('Помилка отримання тренерів для adminpanel:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    renderAdminTrainingsPage: async (req, res) => {
        try {
            await TrainingService.updateStatusForPastTrainings();
            const trainings = await TrainingService.getAllTrainings();
            const formattedTrainings = formatTrainings(trainings);
            const sortedTrainings = sortTrainings(formattedTrainings);

            res.render('admin/adminpanel-trainings', {
                trainings: sortedTrainings,
            });
        } catch (err) {
            console.error('Помилка отримання тренувань для adminpanel:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    renderAdminUsersPage: async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            const processedUsers = processUsers(users);
            res.render('admin/adminpanel-users', { users: processedUsers });
        } catch (err) {
            console.error('Помилка отримання користувачів для adminpanel:', err);
            res.status(500).send('Помилка сервера');
        }
    },


};

module.exports = AdminController;