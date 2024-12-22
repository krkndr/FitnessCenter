const Program = require('../models/program');

const ProgramService = {
    getAllPrograms: () => {
        return new Promise((resolve, reject) => {
            Program.getAllPrograms((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    getProgramById: (programId) => {
        return new Promise((resolve, reject) => {
            Program.getProgramById(programId, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    createProgram: async (programData) => {
        return new Promise((resolve, reject) => {
            Program.create(programData, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    deleteProgram: (programId) => {
        return new Promise((resolve, reject) => {
            Program.deleteById(programId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    updateProgram: (programId, updatedData) => {
        return new Promise((resolve, reject) => {
            Program.update(programId, updatedData, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
};

module.exports = ProgramService;
