/*document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const leftButton = document.querySelector('.left-btn');
    const rightButton = document.querySelector('.right-btn');

    const cardWidth = track.querySelector('.team-card').offsetWidth + 30;
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
});*/
