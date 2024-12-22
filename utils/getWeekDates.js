//utils/getWeekDates.js

const { startOfWeek, endOfWeek, addDays, format, subWeeks, addWeeks } = require('date-fns');
const { uk } = require('date-fns/locale'); // Правильний спосіб імпортувати українську локалізацію

const TrainingService = require('../services/trainingService'); // Add import for training service

async function getWeekDates(date = new Date(), direction = 'current') {
    let targetDate = date;

    // If moving to the next or previous week
    if (direction === 'next') {
        targetDate = addWeeks(targetDate, 1);
    } else if (direction === 'previous') {
        targetDate = date;
    }

    // Get the start and end of the week
    const startDate = startOfWeek(targetDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(targetDate, { weekStartsOn: 1 });

    // Create an array of dates for the current week
    const weekDates = [];
    for (let i = 0; i <= 6; i++) {
        const currentDate = addDays(startDate, i);
        const formattedDate = format(currentDate, 'dd.MM.yyyy');

        // Get trainings for this date
        const trainings = await TrainingService.getFilteredTrainingsByDate(currentDate);  // Fetch trainings for this date

        weekDates.push({
            date: formattedDate,
            trainings: trainings,  // Include the trainings for this date
        });
    }

    return {
        weekDates,
        startOfWeekFormatted: format(startDate, 'dd MMMM', { locale: uk }), // Використовуємо правильну локалізацію
        endOfWeekFormatted: format(endDate, 'dd MMMM', { locale: uk }), // Використовуємо правильну локалізацію
    };
}



module.exports = getWeekDates;
