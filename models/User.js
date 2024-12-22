const connection = require('../models/database.js');

const User = {
    connection,

    getById: (id, callback) => {
        const query = `SELECT * FROM users WHERE id_user = ?`;
        connection.query(query, [id], callback);
    },

    findByLogin: (login, callback) => {
        const query = `SELECT u.*, r.name AS role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id_role
            WHERE u.login = ?`;
        connection.query(query, [login], callback);
    },

    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], callback);
    },

    findByPhone: (phone, callback) => {
        const query = 'SELECT * FROM users WHERE phone = ?';
        connection.query(query, [phone], callback);
    },

    create: (userData, callback) => {
        const { name_surname, login, email, phone, password, role_id } = userData;
        const query = `
            INSERT INTO users (name_surname, login, email, phone, password, role_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(query, [name_surname, login, email, phone, password, role_id], callback);
    },

    update: (id, data, callback) => {
        const query = `
        UPDATE users 
        SET name_surname = ?, login = ?, email = ?, phone = ?, role_id = ?
        WHERE id_user = ?
    `;
        connection.query(query, [data.name_surname, data.login, data.email, data.phone, data.role_id, id], callback);
    },

    updateRole: (userId, newRole, callback) => {
        const query = `UPDATE users SET role_id = ? WHERE id_user = ?`;
        connection.query(query, [newRole, userId], callback);
    },

    updatePassword: (userId, hashedPassword, callback) => {
        const query = `UPDATE users SET password = ? WHERE id_user = ?`;
        connection.query(query, [hashedPassword, userId], callback);
    },

    deleteById: (id, callback) => {
        const deleteUserMembershipQuery = 'DELETE FROM user_membership WHERE user_id = ?';
        connection.query(deleteUserMembershipQuery, [id], (err) => {
            if (err) {
                return callback(err);
            }
            const deleteTrainingUsersQuery = 'DELETE FROM training_users WHERE user_id = ?';
            connection.query(deleteTrainingUsersQuery, [id], (err) => {
                if (err) {
                    return callback(err);
                }
                const deleteUserQuery = 'DELETE FROM users WHERE id_user = ?';
                connection.query(deleteUserQuery, [id], callback);
            });
        });
    },

    getAllUsers: (callback) => {
        const query = `
            SELECT
                u.id_user,
                u.name_surname AS name,
                u.email,
                u.login,
                u.phone,
                r.name AS role_name,
                m.name AS membership_name,
                MAX(um.start_date) AS start_date,
                um.end_date
            FROM users u
                     LEFT JOIN roles r ON u.role_id = r.id_role
                     LEFT JOIN user_membership um ON u.id_user = um.user_id
                     LEFT JOIN membership m ON um.membership_id = m.id_membership
            GROUP BY u.id_user, u.name_surname, u.email, u.login, u.phone, r.name, m.name, um.end_date
        `;
        connection.query(query, callback);
    },

    getMembership: (userId, callback) => {
        const query = `
            SELECT m.name AS membership_name, m.duration, u.start_date, u.end_date
            FROM user_membership u
            JOIN membership m ON u.membership_id = m.id_membership
            WHERE u.user_id = ? AND CURDATE() BETWEEN u.start_date AND u.end_date
        `;
        connection.query(query, [userId], callback);
    },

    addMembership: (userId, membershipId, startDate, endDate, callback) => {
        const query = `
            INSERT INTO user_membership (user_id, membership_id, start_date, end_date) 
            VALUES (?, ?, ?, ?)
        `;
        connection.query(query, [userId, membershipId, startDate, endDate], callback);
    },

    getTrainings: (userId, callback) => {
        const query = `
            SELECT
                tr.id_training,
                ut.id_training_users,
                tr.date,
                tr.time,
                p.name AS program_name,
                t.full_name AS trainer_name,
                ut.status
            FROM training tr
                     JOIN training_users ut ON tr.id_training = ut.training_id
                     JOIN trainers t ON tr.trainer_id = t.id_trainer
                     JOIN programs p ON tr.program_id = p.id_program
            WHERE ut.user_id = ?
        `;
        connection.query(query, [userId], callback);
    },
};

module.exports = User;
