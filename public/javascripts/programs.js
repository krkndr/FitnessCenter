/*document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const leftButton = document.querySelector('.left-btn');
    const rightButton = document.querySelector('.right-btn');

    const cardWidth = track.querySelector('.service-card').offsetWidth + 30; // Додаємо відступи (gap)
    let currentIndex = 0;

    rightButton.addEventListener('click', () => {
        if (currentIndex < track.children.length - 3) {
            currentIndex++;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
    });

    leftButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо всі кнопки "Детальніше"
    const buttons = document.querySelectorAll('.description a');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const descriptionContainer = button.closest('.description');
            const fullDescription = descriptionContainer.querySelector('.full-description');
            const shortDescription = descriptionContainer.querySelector('.short-description');

            // Якщо повний опис ще не видимий, показуємо його
            if (fullDescription.style.display === 'none') {
                fullDescription.style.display = 'block';
                shortDescription.style.display = 'none';
                button.textContent = 'Згорнути';
            } else {
                // Якщо опис вже видимий, приховуємо його
                fullDescription.style.display = 'none';
                shortDescription.style.display = 'block';
                button.textContent = 'Детальніше';
            }
        });
    });
});
*/

