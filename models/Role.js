const connection = require('../models/database.js');

const Role = {
    connection,
    getAllRoles: (callback) => {
        const query = 'SELECT * FROM roles';
        connection.query(query, callback);
    },
};

module.exports = Role;