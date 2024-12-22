document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-training-btn');

    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            // Зупиняємо стандартну поведінку (якщо є)
            event.preventDefault();
            event.stopPropagation();

            const trainingId = button.getAttribute('data-id');
            if (confirm('Ви впевнені, що хочете видалити це тренування?')) {
                try {
                    // Відправляємо запит на сервер
                    const response = await fetch(`/trainings/delete/${trainingId}`, {
                        method: 'DELETE',
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);

                        // Видаляємо рядок з таблиці
                        button.closest('tr').remove();
                    } else {
                        alert(`Помилка: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Помилка при видаленні тренування:', error);
                    alert('Сталася помилка при видаленні тренування.');
                }
            }
        });
    });
});

// Очікуємо, поки весь DOM завантажиться
document.addEventListener("DOMContentLoaded", function() {
    // Знаходимо всі кнопки видалення
    const deleteButtons = document.querySelectorAll('.delete-user-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const userId = this.getAttribute('data-id');

            if (confirm("Ви впевнені, що хочете видалити цього користувача?")) {
                try {
                    // Відправляємо DELETE-запит на сервер
                    const response = await fetch(`/users/delete/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        // Перезавантажуємо сторінку, щоб відобразити зміни
                        window.location.reload();
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Помилка при видаленні користувача:', error);
                    alert('Сталася помилка при видаленні користувача.');
                }
            }
        });
    });
});

// Очікуємо, поки весь DOM завантажиться
document.addEventListener("DOMContentLoaded", function() {
    // Знаходимо всі кнопки видалення
    const deleteButtons = document.querySelectorAll('.delete-trainer-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const trainerId = this.getAttribute('data-id');

            if (confirm("Ви впевнені, що хочете видалити цього тренера?")) {
                try {
                    // Відправляємо DELETE-запит на сервер
                    const response = await fetch(`/trainers/delete/${trainerId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        // Перезавантажуємо сторінку, щоб відобразити зміни
                        window.location.reload();
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Помилка при видаленні тренера:', error);
                    alert('Сталася помилка при видаленні тренера.');
                }
            }
        });
    });
});

// Очікуємо, поки весь DOM завантажиться
document.addEventListener("DOMContentLoaded", function() {
    // Знаходимо всі кнопки видалення
    const deleteButtons = document.querySelectorAll('.delete-program-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const programId = this.getAttribute('data-id');

            if (confirm("Ви впевнені, що хочете видалити цю програму?")) {
                try {
                    // Відправляємо DELETE-запит на сервер
                    const response = await fetch(`/programs/delete/${programId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        // Перезавантажуємо сторінку, щоб відобразити зміни
                        window.location.reload();
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Помилка при видаленні програми:', error);
                    alert('Сталася помилка при видаленні програми.');
                }
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Знаходимо всі кнопки видалення
    const deleteButtons = document.querySelectorAll('.delete-membership-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const membershipId = this.getAttribute('data-id');

            if (confirm("Ви впевнені, що хочете видалити цей абонемент?")) {
                try {
                    const response = await fetch(`/memberships/delete/${membershipId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        window.location.reload();
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Помилка при видаленні абонемента:', error);
                    alert('Сталася помилка при видаленні абонемента.');
                }
            }
        });
    });
});