
function toggleMembershipForm() {
    const formContainer = document.getElementById('membershipFormContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block'; // Показати форму
    } else {
        formContainer.style.display = 'none'; // Приховати форму
    }
}

function toggleUserEditForm() {
    const formContainer = document.getElementById('userEditFormContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block'; // Показати форму
    } else {
        formContainer.style.display = 'none'; // Приховати форму
    }
}
window.toggleUserEditForm = toggleUserEditForm;

function toggleChangePasswordForm() {
    const formContainer = document.getElementById('changePasswordFormContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block'; // Показати форму
    } else {
        formContainer.style.display = 'none'; // Приховати форму
    }
}
window.toggleChangePasswordForm = toggleChangePasswordForm;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.membership-form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Зупиняємо стандартну відправку форми

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                toggleMembershipForm();
                window.location.href = result.redirectUrl;

            } else {
                alert(`Помилка: ${result.message}`);
            }
        } catch (error) {
            console.error('Помилка під час купівлі абонемента:', error);
            alert('Сталася помилка. Спробуйте пізніше.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.edit-user-form-dashboard').addEventListener('submit', async (e) => {
        e.preventDefault(); // Зупиняємо стандартну відправку форми

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                window.toggleUserEditForm();
                window.location.href = result.redirectUrl;

            } else {
                alert(`Помилка: ${result.message}`);
            }
        } catch (error) {
            console.error('Помилка під час оновлення даних:', error);
            alert('Сталася помилка. Спробуйте пізніше.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.change-password-form-container').addEventListener('submit', async (e) => {
        e.preventDefault(); // Зупиняємо стандартну відправку форми

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                window.toggleChangePasswordForm();
                window.location.href = result.redirectUrl;

            } else {
                alert(`Помилка: ${result.message}`);
            }
        } catch (error) {
            console.error('Помилка під час зміни паролю:', error);
            alert('Сталася помилка. Спробуйте пізніше.');
        }
    });
});

function cancelTraining(trainingId) {
    fetch('/dashboard/cancel-training', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainingId }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(data.message);
                location.reload(); // Оновлення сторінки
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Помилка:', error);
            alert('Сталася помилка');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const timeButtons = document.querySelectorAll('.btn-time');
    const trainingIdInput = document.getElementById('training_id');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const trainingId = button.getAttribute('data-id');
            trainingIdInput.value = trainingId;
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const timeButtons = document.querySelectorAll('.btn-time');

    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registerForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const trainingId = formData.get('training_id');
            try {
                const response = await fetch('/dashboard/sing-up-training/register-training', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ training_id: trainingId }),
                });

                const result = await response.json();

                if (result.success) {
                    alert(result.message);
                    window.location.href = '/dashboard/sing-up-training';
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Помилка під час реєстрації:', error);
                alert('Сталася неочікувана помилка. Спробуйте пізніше.');
            }
        });
    }
});
