const connection = require('../models/database.js');

const Membership = {
    connection,

    getAllMemberships: (callback) => {
        const query = `SELECT * FROM membership`;
        connection.query(query, callback);
    },

    create: (membership, callback) => {
        const { name, description, price, duration} = membership;
        const query = 'INSERT INTO membership (name, description, price, duration) VALUES (?, ?, ?, ?)';
        connection.query(query, [name, description, price, duration], callback);
    },

    deleteById: (id, callback) => {
        const query = 'DELETE FROM membership WHERE id_membership = ?';
        connection.query(query, [id], callback);
    },

    update: (membershipId, updatedData, callback) => {
        const { name, description, price, duration } = updatedData;
        const query = 'UPDATE membership SET name = ?, description = ?, price = ?, duration = ?  WHERE id_membership = ?';
        connection.query(query, [name, description, price, duration, membershipId], callback);
    },

    checkActiveMemberships: (membershipId, callback) => {
        const query = `
        SELECT COUNT(*) AS activeCount
        FROM user_membership
        WHERE membership_id = ? AND end_date > NOW()
    `;
        Membership.connection.query(query, [membershipId], callback);
    },

};

module.exports = Membership;
