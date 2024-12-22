// models/Trainer.js

const connection = require('../models/database.js');

const Trainer = {
    connection,

    getAllTrainers: (callback) => {
        const query = `
            SELECT 
                t.id_trainer, 
                t.full_name, 
                t.date_of_birth, 
                t.phone, 
                t.date_of_employment,
                t.description,
                p.name AS program_name,
                p.description AS program_description,
                p.type AS program_type
            FROM trainers t
            LEFT JOIN programs p ON t.program_id = p.id_program
        `;
        connection.query(query, callback);
    },

    findByPhone: (phone, callback) => {
        const query = 'SELECT * FROM trainers WHERE phone = ?';
        connection.query(query, [phone], callback);
    },

    getTrainerById: (trainerId, callback) => {
        const query = 'SELECT * FROM trainers WHERE id_trainer = ?';
        connection.query(query, [trainerId], callback);
    },

    deleteById: (id, callback) => {
        const query = 'DELETE FROM trainers WHERE id_trainer = ?';
        connection.query(query, [id], callback);
    },

    create: (trainerData, callback) => {
        const { full_name, date_of_birth, phone, date_of_employment, program_id, description } = trainerData;
        const query = `
            INSERT INTO trainers (full_name, date_of_birth, phone, date_of_employment, program_id, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(query, [full_name, date_of_birth, phone, date_of_employment, program_id, description], callback);
    },

    update: (trainerId, updatedData, callback) => {
        const { full_name, date_of_birth, phone, date_of_employment, program_id, description } = updatedData;
        const query = `
            UPDATE trainers 
            SET full_name = ?, date_of_birth = ?, phone = ?, date_of_employment = ?, program_id = ?, description = ?
            WHERE id_trainer = ?
        `;
        connection.query(query, [full_name, date_of_birth, phone, date_of_employment, program_id, description, trainerId], callback);
    },
};

module.exports = Trainer;
