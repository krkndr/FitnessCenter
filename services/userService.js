const bcrypt = require('bcrypt');
const User = require('../models/User');
const TrainingUser = require('../models/trainingUser');


const UserService = {

    loginUser: (login, plainPassword) => {
        return new Promise((resolve, reject) => {
            User.findByLogin(login, async (err, results) => {
                if (err) {
                    return reject('Помилка бази даних');
                }
                if (results.length === 0) {
                    return reject('Неправильний логін або пароль!');
                }
                const user = results[0];
                const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
                if (!isPasswordValid) {
                    return reject('Неправильний логін або пароль!');
                }
                resolve(user);
            });
        });
    },

    registerUser: async (userData) => {
        const { name_surname, login, email, phone, password, confirmPassword } = userData;
        let role_id = 2;

        if (password !== confirmPassword) {
            throw new Error("Паролі не співпадають.");
        }

        const phoneRegex = /^380\d{9}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Невірний формат номера телефону. Номер має починатись з '380' і містити 12 цифр.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Невірний формат електронної пошти.");
        }

        await new Promise((resolve, reject) => {
            User.findByLogin(login, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return reject(new Error("Логін вже існує."));
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return reject(new Error("Електронна пошта вже використовується."));
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            User.findByPhone(phone, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return reject(new Error("Номер телефону вже використовується."));
                resolve();
            });
        });

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        return new Promise((resolve, reject) => {
            User.create(
                { name_surname, login, email, phone, password: hashedPassword, role_id },
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            User.getAllUsers((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            User.getById(id, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    createUser: async (userData) => {
        const { name_surname, login, email, phone, password, confirmPassword, role_id } = userData;

        if (password !== confirmPassword) {
            throw new Error("Паролі не співпадають.");
        }

        const phoneRegex = /^380\d{9}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Невірний формат номера телефону. Номер має починатись з '380' і містити 12 цифр.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Невірний формат електронної пошти.");
        }

        await new Promise((resolve, reject) => {
            User.findByLogin(login, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return reject(new Error("Логін вже існує."));
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return reject(new Error("Електронна пошта вже використовується."));
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            User.findByPhone(phone, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return reject(new Error("Номер телефону вже використовується."));
                resolve();
            });
        });

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        await new Promise((resolve, reject) => {
            User.create(
                { name_surname, login, email, phone, password: hashedPassword, role_id },
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
        return { success: true };
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            User.deleteById(userId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    updateUser: async (userId, newRole) => {
        return new Promise((resolve, reject) => {
            User.updateRole(userId, newRole, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

    },

    getUserMembership: (userId) => {
        return new Promise((resolve, reject) => {
            User.getMembership(userId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });
    },

    addMembership: async (userId, membershipId, startDate, endDate) => {
        return new Promise((resolve, reject) => {
            User.addMembership(userId, membershipId, startDate, endDate, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getTrainingsForUser: (userId, callback) => {
        TrainingUser.updateCompletedTrainingsStatus(userId, (err) => {
            if (err) {
                console.error('Не вдалося оновити статуси тренувань:', err);
                return callback(err);
            }
            User.getTrainings(userId, callback);
        });
    },

    editUserDashboard: async (userId, userData) => {
        const { name_surname, login, email, phone } = userData;

        const phoneRegex = /^380\d{9}$/;
        if (phone && !phoneRegex.test(phone)) {
            throw new Error("Невірний формат номера телефону. Номер має починатись з '380' і містити 12 цифр.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            throw new Error("Невірний формат електронної пошти.");
        }

        await new Promise((resolve, reject) => {
            User.findByLogin(login, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0 && Number(results[0].id_user) !== Number(userId)) {
                    return reject(new Error("Логін вже існує."));
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0 && Number(results[0].id_user) !== Number(userId)) {
                    return reject(new Error("Електронна пошта вже використовується."));
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            User.findByPhone(phone, (err, results) => {
                if (err) return reject(err);
                if (results.length > 0 && Number(results[0].id_user) !== Number(userId)) {
                    return reject(new Error("Номер телефону вже використовується."));
                }
                resolve();
            });
        });

        return new Promise((resolve, reject) => {
            User.update(userId, userData, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    changePassword: async (userId, currentPassword, newPassword, newConfirmPassword) => {
        if (newPassword !== newConfirmPassword) {
            throw new Error('Нові паролі не співпадають.');
        }
        const user = await new Promise((resolve, reject) => {
            User.getById(userId, (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error('Користувача не знайдено.'));
                resolve(results[0]);
            });
        });

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new Error('Невірний поточний пароль.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        return new Promise((resolve, reject) => {
            User.updatePassword(userId, hashedPassword, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },
};

module.exports = UserService;
