const Role = require('../models/Role');

const RoleService = {
    getAllRoles: () => {
        return new Promise((resolve, reject) => {
            Role.getAllRoles((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
};

module.exports = RoleService;
