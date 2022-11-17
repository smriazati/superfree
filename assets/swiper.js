document.addEventListener('DOMContentLoaded', initSwiper, false);
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    console.log(swiper);
}

