const TrainingUser = require('../models/trainingUser');

const TrainingUserService = {
    create: (trainingId, userId, status) => {
        return new Promise((resolve, reject) => {
            TrainingUser.create(trainingId, userId, status, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    checkExistingRegistration: (trainingId, userId) => {
        return new Promise((resolve, reject) => {
            TrainingUser.checkExistingRegistration(trainingId, userId, (err, exists) => {
                if (err) {
                    return reject(err);
                }
                resolve(exists);
            });
        });
    },

    cancelTraining: (userId, trainingId) => {
        return new Promise((resolve, reject) => {
            TrainingUser.cancelTraining(userId, trainingId, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows > 0) {
                    resolve({ success: true, message: 'Тренування успішно відмінено' });
                } else {
                    resolve({ success: false, message: 'Тренування вже відмінене або не знайдене' });
                }
            });
        });
    },

    hasRegistrations: async (trainingId) => {
        try {
            return await TrainingUser.hasRegistrations(trainingId);
        } catch (error) {
            console.error('Помилка перевірки записів на тренування:', error);
            throw error;
        }
    },
};

module.exports = TrainingUserService;
