const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

const processUsers = (users) => {
    // Створимо об'єкт для зберігання користувачів за ID
    const usersMap = {};

    users.forEach((user) => {
        const userId = user.id_user;

        // Якщо користувача ще немає в мапі, додаємо його
        if (!usersMap[userId]) {
            usersMap[userId] = user;
        } else {
            // Якщо вже є, зберігаємо запис із найновішою start_date
            const existingUserStartDate = new Date(usersMap[userId].start_date || 0);
            const currentUserStartDate = new Date(user.start_date || 0);

            if (currentUserStartDate > existingUserStartDate) {
                usersMap[userId] = user;
            }
        }
    });

    // Форматуємо дати в кожному записі
    return Object.values(usersMap).map((user) => {
        return {
            ...user,
            start_date: formatDate(user.start_date),
            end_date: formatDate(user.end_date),
        };
    });
};

module.exports = processUsers;
