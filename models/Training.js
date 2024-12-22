// models/training.js

const connection = require('../models/database.js');

const Training = {
    connection,

    create: (trainingData) => {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO training (program_id, date, time, trainer_id, quantity)
            VALUES (?, ?, ?, ?, ?)
        `;
            const { program_id, date, time, trainer_id, quantity } = trainingData;
            connection.query(query, [program_id, date, time, trainer_id, quantity], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getFilteredTrainings: (programId, date, callback) => {
        const query = `
            SELECT
                t.id_training,
                t.date,
                t.time,
                t.quantity,
                t.program_id,
                p.name AS program_name,
                tr.full_name AS trainer_name
            FROM training t
                     JOIN trainers tr ON t.trainer_id = tr.id_trainer
                     JOIN programs p ON t.program_id = p.id_program
            WHERE t.program_id = ? AND t.date = ? AND t.quantity > 0
        `;
        connection.query(query, [programId, date], callback);
    },

    decrementQuantity: (trainingId, callback) => {
        const query = `
            UPDATE training
            SET quantity = quantity - 1
            WHERE id_training = ? AND quantity > 0
        `;
        connection.query(query, [trainingId], callback);
    },

    getAllTrainings: (callback) => {
        const query = `
            SELECT
                tr.id_training,
                tr.date,
                tr.time,
                p.name AS program_name,
                t.full_name AS trainer_name,
                tr.quantity,
                tr.status
            FROM training tr
            JOIN trainers t ON tr.trainer_id = t.id_trainer
            JOIN programs p ON tr.program_id = p.id_program
        `;
        connection.query(query, callback);
    },


    getFilteredTrainingsByDate: (date, callback) => {
        const query = `
                SELECT
                    t.id_training,
                    t.date,
                    t.time,
                    t.quantity,
                    t.program_id,
                    p.name AS program_name,
                    tr.full_name AS trainer_name
                FROM training t
                JOIN trainers tr ON t.trainer_id = tr.id_trainer
                JOIN programs p ON t.program_id = p.id_program
                WHERE t.date = ? AND p.type = 'group'
            `;
        connection.query(query, [date], callback);
    },

    updatePastTrainingsStatus: (callback) => {
        const query = `
            UPDATE training
            SET status = 'completed'
            WHERE status = 'scheduled' AND (date < CURDATE() OR (date = CURDATE() AND time < CURTIME()))
        `;
        connection.query(query, callback);
    },

    deleteById: (id, callback) => {
        const deleteFromTrainingQuery = 'DELETE FROM training WHERE id_training = ?';
        connection.query(deleteFromTrainingQuery, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },

    update: (id, data, callback) => {
        const query = `
            UPDATE training
            SET program_id = ?, date = ?, time = ?, trainer_id = ?, quantity = ?
            WHERE id_training = ?
        `;
        connection.query(query, [data.program_id, data.date, data.time, data.trainer_id, data.quantity, id], callback);
    },

    getById: (id, callback) => {
        const query = `SELECT * FROM training WHERE id_training = ?`;
        connection.query(query, [id], callback);
    },

    checkTrainerAvailability: (trainer_id, date, time, callback) => {
        const query = `
        SELECT * FROM training
        WHERE trainer_id = ? AND date = ? AND time < ADDTIME(?, '01:00:00') AND ADDTIME(time, '01:00:00') > ?
    `;
        connection.query(query, [trainer_id, date, time, time], callback);
    },

    checkTrainerAssignedToPlannedTrainings: (trainerId, callback) => {
        const query = `
        SELECT COUNT(*) AS plannedCount
        FROM training
        WHERE trainer_id = ? AND status = 'scheduled'
    `;
        Training.connection.query(query, [trainerId], callback);
    },

    updateTrainerStatus: (trainerId, callback) => {
        const query = `
        UPDATE training
        SET trainer_id = NULL
        WHERE trainer_id = ?`;
        connection.query(query, [trainerId], callback);
    },

    checkTrainingsByProgramId: (programId, callback) => {
        const query = 'SELECT COUNT(*) AS count FROM training WHERE program_id = ?';
        connection.query(query, [programId], callback);
    }

};

module.exports = Training;
