const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

const carouselSlides = document.getElementById('carousel-slides');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
const totalSlides = slides.length;
let autoSlide;

function showSlide(index) {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    currentSlide = index;

    carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    autoSlide = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlide);
}

prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    showSlide(currentSlide - 1);
    startAutoSlide();
});

nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    showSlide(currentSlide + 1);
    startAutoSlide();
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
    });
});

startAutoSlide();