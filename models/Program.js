const connection = require('../models/database.js');

const Program = {
    connection,

    getAllPrograms: (callback) => {
        const query = 'SELECT * FROM programs';
        connection.query(query, callback);
    },

    getProgramById: (programId, callback) => {
        const query = 'SELECT * FROM programs WHERE id_program = ?';
        connection.query(query, [programId], callback);
    },

    create: (program, callback) => {
        const { name, description, type } = program;
        const query = 'INSERT INTO programs (name, description, type) VALUES (?, ?, ?)';
        connection.query(query, [name, description, type], callback);
    },

    deleteById: (id, callback) => {
        const query = 'DELETE FROM programs WHERE id_program = ?';
        connection.query(query, [id], callback);
    },

    update: (programId, updatedData, callback) => {
        const { name, description, type } = updatedData;
        const query = 'UPDATE programs SET name = ?, description = ?, type = ? WHERE id_program = ?';
        connection.query(query, [name, description, type, programId], callback);
    }
};

module.exports = Program;
