const connection = require('./database');

const TrainingUser = {
    create: (trainingId, userId, status, callback) => {
        const query = `
            INSERT INTO training_users (training_id, user_id, status)
            VALUES (?, ?, ?)
        `;
        connection.query(query, [trainingId, userId, status], callback);
    },

    checkExistingRegistration: (trainingId, userId, callback) => {
        const query = `
            SELECT * FROM training_users 
            WHERE training_id = ? AND user_id = ? AND status = 'registered'
        `;
        connection.query(query, [trainingId, userId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.length > 0);
        });
    },

    updateCompletedTrainingsStatus: (userId, callback) => {
        const query = `
            UPDATE training_users
            SET status = 'attended'
            WHERE training_id IN (
                SELECT id_training
                FROM training
                WHERE (date < CURDATE() OR (date = CURDATE() AND time < CURTIME()))
            )
            AND user_id = ?  
            AND status = 'registered';
        `;
        connection.query(query, [userId], callback);
    },

    cancelTraining: (userId, trainingId, callback) => {
        const query = `
            UPDATE training_users
            SET status = 'canceled'
            WHERE user_id = ? AND training_id = ? AND status = 'registered';
        `;
        connection.query(query, [userId, trainingId], (err, result) => {
            if (err) return callback(err);

            if (result.affectedRows > 0) {
                const updateQuantityQuery = `
                    UPDATE training
                    SET quantity = quantity + 1 
                    WHERE id_training = ? AND quantity > -1;
                `;
                connection.query(updateQuantityQuery, [trainingId], callback);
            } else {
                callback(null, result);
            }
        });
    },

    hasRegistrations: (trainingId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT COUNT(*) AS count
                FROM training_users
                WHERE training_id = ?;
            `;
            connection.query(query, [trainingId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count > 0);
            });
        });
    },
};

module.exports = TrainingUser;
