const Trainer = require('../models/Trainer');

const TrainerService = {

    getAllTrainers: () => {
        return new Promise((resolve, reject) => {
            Trainer.getAllTrainers((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getTrainerById: (trainerId) => {
        return new Promise((resolve, reject) => {
            Trainer.getTrainerById(trainerId, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    createTrainer: async (trainerData) => {
        const { full_name, date_of_birth, phone, date_of_employment, program_id, description} = trainerData;
        const phoneRegex = /^380\d{9}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Невірний формат номера телефону. Номер має починатися з '380' і містити 12 цифр.");
        }
        const isPhoneTaken = await new Promise((resolve, reject) => {
            Trainer.findByPhone(phone, (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0);
            });
        });

        if (isPhoneTaken) {
            throw new Error("Цей номер телефону вже використовується.");
        }

        return new Promise((resolve, reject) => {
            Trainer.create({ full_name, date_of_birth, phone, date_of_employment, program_id, description }, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    deleteTrainer: (trainerId) => {
        return new Promise((resolve, reject) => {
            Trainer.deleteById(trainerId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    updateTrainer: async (trainerId, updatedData) => {
        const { full_name, date_of_birth, phone, date_of_employment, program_id, description } = updatedData;

        const phoneRegex = /^380\d{9}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Невірний формат номера телефону.");
        }
        console.log(trainerId);

        const isPhoneTaken = await new Promise((resolve, reject) => {
            Trainer.findByPhone(phone, (err, results) => {
                if (err) return reject(err);

                if (results.length > 0 && Number(results[0].id_trainer) !== Number(trainerId)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

        if (isPhoneTaken) {
            throw new Error("Цей номер телефону вже використовується.");
        }

        return new Promise((resolve, reject) => {
            Trainer.update(trainerId, { full_name, date_of_birth, phone, date_of_employment, program_id, description }, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

};

module.exports = TrainerService;
