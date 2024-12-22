const { format } = require('date-fns');
const { uk } = require('date-fns/locale'); // Для форматування українською

/**
 * Форматування тренувань
 * @param {Array} trainings - Масив тренувань
 * @returns {Array} - Відформатований масив
 */
const formatTrainings = (trainings) => {
    return trainings.map((training) => ({
        ...training,
        date: format(new Date(training.date), 'dd.MM.yyyy', { locale: uk }), // Формат дати
        time: training.time.slice(0, 5), // Формат часу HH:mm
    }));
};

module.exports = formatTrainings;
