const sortTrainings = (trainings) => {
    return trainings.sort((a, b) => {
        if (a.status === 'scheduled' && b.status === 'completed') {
            return -1; // 'scheduled' має йти вище
        }
        if (a.status === 'completed' && b.status === 'scheduled') {
            return 1; // 'completed' має йти нижче
        }
        return 0; // Якщо статуси однакові, порядок не змінюється
    });
};

module.exports = sortTrainings;