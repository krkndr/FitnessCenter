const Membership = require('../models/Membership');

const MembershipService = {
    getAllMemberships: async () => {
        return new Promise((resolve, reject) => {
            Membership.getAllMemberships((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getMembershipById: async (membershipId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM membership WHERE id_membership = ?`;
            Membership.connection.query(query, [membershipId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    createMembership: async (membershipData) => {
        return new Promise((resolve, reject) => {
            const { name, description, price, duration } = membershipData;

            if (isNaN(price) || parseFloat(price) <= 0) {
                throw new Error("Ціна повинна бути числом більше нуля");
            }
            if (isNaN(duration) || parseFloat(duration) <= 0) {
                throw new Error("Тривалість повинна бути числом більше нуля");
            }
            Membership.create(membershipData, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    deleteMembership: (membershipId) => {
        return new Promise((resolve, reject) => {
            Membership.deleteById(membershipId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    checkActiveMemberships: (membershipId) => {
        return new Promise((resolve, reject) => {
            Membership.checkActiveMemberships(membershipId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                const activeCount = results[0]?.activeCount || 0;
                resolve(activeCount > 0);
            });
        });
    },

    updateMembership: (membershipId, updatedData) => {
        return new Promise((resolve, reject) => {
            Membership.update(membershipId, updatedData, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
};

module.exports = MembershipService;
