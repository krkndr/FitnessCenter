const UserService = require('../services/UserService.js');
const RoleService = require("../services/roleService");
const TrainingUserService = require("../services/trainingUserService");
const MembershipService = require('../services/MembershipService');
const { formatToDDMMYYYY } = require('../utils/dateFormatter');
const processUsers = require('../utils/formatUsers.js');


const UserController = {

    renderCreateUserPage: async (req, res) => {
        try {
            const roles = await RoleService.getAllRoles();
            res.render('admin/create/create-user', {roles});
        } catch (err) {
            console.error('Помилка відкриття форми створення тренування:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    createUser: async (req, res) => {
        try {
            const userData = req.body;
            await UserService.createUser(userData);
            res.status(200).json({success: true});
        } catch (err) {
            console.error('Помилка створення користувача:', err);
            res.status(400).json({success: false, message: err.message});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            res.json({ success: true, message: 'Користувача успішно видалено.' });
        } catch (error) {
            console.error('Помилка видалення користувача:', error);
            res.status(500).json({ success: false, message: 'Не вдалося видалити користувача.' });
        }
    },

    renderEditUserPage: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await UserService.getUserById(userId);
            const roles = await RoleService.getAllRoles();
            const singleUser = user[0];
            res.render('admin/edit/edit-user', { user: singleUser, roles });
        } catch (err) {
            console.error('Помилка відкриття сторінки деталей тренування:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    updateUser: async (req, res) => {
        const userId = req.params.id;
        const newRole = req.body;
        try {
            await UserService.updateUser(userId, newRole);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Помилка оновлення користувача:', err);
            res.status(400).json({ success: false, message: err.message });
        }
    },

    registerUser: async (req, res) => {
        try {
            const userData = req.body;
            const newUser = await UserService.registerUser(userData);
            req.session.user = {
                id: newUser.insertId,
                login: userData.login,
                role: 'user',
            };
            res.status(200).json({ success: true, redirectUrl: '/dashboard' });
        } catch (err) {
            console.error('Помилка реєстрації користувача:', err);
            res.status(400).json({ success: false, message: err.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { login, password } = req.body;
            const user = await UserService.loginUser(login, password);
            req.session.user = {
                id: user.id_user,
                login: user.login,
                role: user.role_name,
            };
            res.status(200).json({ success: true, redirectUrl: '/dashboard' });
        } catch (err) {
            console.error('Помилка авторизації користувача:', err);
            res.status(400).json({ success: false, message: err });
        }
    },

    logoutUser: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Помилка під час видалення сесії:', err);
                return res.status(500).send('Помилка на сервері');
            }
            res.redirect('/');
        });
    },

    buyMembership: async (req, res) => {
        try {
            const userId = req.session.user?.id;
            const { membershipId } = req.body;
            const membership = await MembershipService.getMembershipById(membershipId);

            if (!membership) {
                return res.status(404).json({ success: false, message: 'Абонемент не знайдено' });
            }

            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + membership.duration);
            await UserService.addMembership(userId, membershipId, startDate, endDate);
            return res.json({ success: true, message: 'Абонемент успішно придбано!', redirectUrl: '/dashboard' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Не вдалося купити абонемент', redirectUrl: '/dashboard' });
        }
    },

    editUserDashboard: async (req, res) => {
        const userId = req.session.user?.id;
        const updatedData = req.body;
        try {
            await UserService.editUserDashboard(userId, updatedData);
            return res.json({ success: true, message: 'Дані успішно оновлені!', redirectUrl: '/dashboard' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }
    },

    changePasswordDashboard: async (req, res) => {
        const userId = req.session.user?.id;
        const { currentPassword, newPassword, newConfirmPassword } = req.body;

        try {
            await UserService.changePassword(userId, currentPassword, newPassword, newConfirmPassword);
            return res.json({ success: true, message: 'Пароль успішно змінено!', redirectUrl: '/dashboard' });
        } catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: err.message });
        }
    },

    renderMyTrainings: (req, res) => {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.redirect('/login');
        }

        UserService.getTrainingsForUser(userId, (err, trainings) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Помилка сервера');
            }

            const formatTrainings = (trainings, status) =>
                trainings
                    .filter(training => training.status === status)
                    .map(training => ({
                        ...training,
                        formattedDate: formatToDDMMYYYY(training.date),
                        formattedTime: training.time.slice(0, 5),
                    }));

            const registeredTrainings = formatTrainings(trainings, 'registered');
            const attendedTrainings = formatTrainings(trainings, 'attended');
            res.render('dashboard/my-trainings', { registeredTrainings, attendedTrainings });
        });
    },

    cancelTraining: async (req, res) => {
        const { trainingId } = req.body;
        const userId = req.session.user?.id;
        try {
            const result = await TrainingUserService.cancelTraining(userId, trainingId);
            return res.json(result);
        } catch (err) {
            console.error('Помилка при відміні тренування:', err);
            return res.status(500).json({ success: false, error: 'Сталася помилка сервера' });
        }
    },
};

module.exports = UserController;
