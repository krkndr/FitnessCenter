const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'MySQL-5.7',
    user: 'root',
    password: '',
    database: 'FitnessCenter'
});

connection.connect((err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err);
        return;
    }
    console.log('Підключено до бази даних MySQL!');
});

module.exports = connection;
