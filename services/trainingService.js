const Training = require('../models/training');
const Program = require('../models/program');
const Trainer = require('../models/trainer');

const TrainingService = {
    getFilteredTrainings: (programId, date) => {
        return new Promise((resolve, reject) => {
            console.log(programId);
            console.log(date);
            Training.getFilteredTrainings(programId, date, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    decrementQuantity: (trainingId) => {
        return new Promise((resolve, reject) => {
            Training.decrementQuantity(trainingId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getAllTrainings: () => {
        return new Promise((resolve, reject) => {
            Training.getAllTrainings((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getFilteredTrainingsByDate: (date) => {
        return new Promise((resolve, reject) => {
            Training.getFilteredTrainingsByDate(date, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    updateStatusForPastTrainings: () => {
        return new Promise((resolve, reject) => {
            Training.updatePastTrainingsStatus((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    isTrainerAssignedToProgram: async (trainerId, programId) => {
        return new Promise((resolve, reject) => {
            Trainer.getTrainerById(trainerId, (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) {
                    console.error('Тренер не знайдений.');
                    return resolve(false);
                }
                if (Number(results[0].program_id) === Number(programId)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },

    isQuantityValidForProgram: async (programId, quantity) => {
        return new Promise((resolve, reject) => {
            Program.getProgramById(programId, (err, results) => {
                if (err) return reject(err);

                if (results.length > 0) {
                    const programType = results[0].type;

                    if (programType === 'individual') {
                        if (Number(quantity) === 1) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }

                    if (programType === 'group') {
                        if (Number(quantity) === 1) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                } else {
                    resolve(false);
                }
            });
        });
    },


    isTrainerAvailable: (trainerId, date, time) => {
        return new Promise((resolve, reject) => {
            Training.checkTrainerAvailability(trainerId, date, time, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length === 0);
            });
        });
    },

    createTraining: async (trainingData) => {
        const { program_id, trainer_id, date, time, quantity } = trainingData;

        const trainingTime = new Date(`1970-01-01T${time}:00`);
        const startTime = new Date('1970-01-01T10:00:00');
        const endTime = new Date('1970-01-01T19:00:00');

        if (quantity < 1 || quantity > 30) {
            throw new Error('Кількість учасників має бути від 1 до 30.');
        }

        if (trainingTime < startTime || trainingTime > endTime) {
            throw new Error('Час тренування має бути в межах від 10:00 до 19:00.');
        }

        const isTrainerAssigned = await TrainingService.isTrainerAssignedToProgram(trainer_id, program_id);
        if (!isTrainerAssigned) {
            throw new Error('Вибраний тренер не асоційований з цією програмою.');
        }

        const isQuantityValid = await TrainingService.isQuantityValidForProgram(program_id, quantity);
        if (!isQuantityValid) {
            throw new Error('Для індивідуальної програми кількість учасників має бути 1, а для групових — більше ніж 1!');
        }

        const isTrainerAvailable = await TrainingService.isTrainerAvailable(trainer_id, date, time);
        if (!isTrainerAvailable) {
            throw new Error('Тренер зайнятий на вказану дату та час.');
        }

        await Training.create(trainingData);
    },

    deleteTraining: (trainingId) => {
        return new Promise((resolve, reject) => {
            Training.deleteById(trainingId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getTrainingById: (id) => {
        return new Promise((resolve, reject) => {
            Training.getById(id, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    updateTraining: async (id, data) => {
        const { program_id, trainer_id, date, time, quantity } = data;

        const trainingTime = new Date(`1970-01-01T${time}:00`);
        const startTime = new Date('1970-01-01T10:00:00');
        const endTime = new Date('1970-01-01T19:00:00');

        if (quantity < 1 || quantity > 30) {
            throw new Error('Кількість учасників має бути від 1 до 30.');
        }

        if (trainingTime < startTime || trainingTime > endTime) {
            throw new Error('Час тренування має бути в межах від 10:00 до 19:00.');
        }

        const isTrainerAssigned = await TrainingService.isTrainerAssignedToProgram(trainer_id, program_id);
        if (!isTrainerAssigned) {
            throw new Error('Вибраний тренер не асоційований з цією програмою.');
        }

        const isQuantityValid = await TrainingService.isQuantityValidForProgram(program_id, quantity);
        if (!isQuantityValid) {
            throw new Error('Для індивідуальної програми кількість учасників має бути 1, а для групових — більше ніж 1!');
        }

        const isTrainerAvailable = await TrainingService.isTrainerAvailable(trainer_id, date, time);
        if (!isTrainerAvailable) {
            throw new Error('Тренер зайнятий на вказану дату та час.');
        }

        return new Promise((resolve, reject) => {
            Training.update(id, data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    checkTrainerAssignedToPlannedTrainings: (trainerId) => {
        return new Promise((resolve, reject) => {
            Training.checkTrainerAssignedToPlannedTrainings(trainerId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                const plannedCount = results[0]?.plannedCount || 0;
                resolve(plannedCount > 0);
            });
        });
    },

    updateTrainingsWithDeletedTrainer: (trainerId) => {
        return new Promise((resolve, reject) => {
            Training.updateTrainerStatus(trainerId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
    checkProgramHasTrainings: (programId) => {
        return new Promise((resolve, reject) => {
            Training.checkTrainingsByProgramId(programId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                const count = results[0].count;
                resolve(count > 0);
            });
        });
    },

};

module.exports = TrainingService;
