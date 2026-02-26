const API_URL = 'https://sotbitfront.netlify.app/.netlify/functions/api';
const TIMEOUT_DURATION = 10000; 

const blogCarousel = document.getElementById('blog');
const loader = document.getElementById('loader');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const indicatorsContainer = document.getElementById('indicators');

let currentIndex = 0;
let slides = [];
let slideCount = 0;
let carouselData = [];
let autoSlideInterval = null;

function showError(message) {
    const existingNotifications = document.querySelectorAll('.error-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <strong>Ошибка!</strong>
        <p style="margin-top: 5px; font-size: 14px;">${message}</p>
    `;
    
    document.body.append(errorDiv);
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 5000);
}

function showLoader() {
    loader.classList.remove('hidden');
    blogCarousel.innerHTML = '';
    indicatorsContainer.classList.add('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function createCarousel(data) {
    blogCarousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    data.forEach((task, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('divCarousel');
        if (index === 0) carouselItem.classList.add('active');
        
        carouselItem.innerHTML = `
            <p><strong>${task.body.title}</strong></p>
            <p style="color: #666; font-size: 14px;">${task.body.category}</p>
            <p style="color: #999; font-size: 12px;">${task.body.date}</p>
            <p style="margin-top: 15px;">${task.body.text}</p>
            <img src="${task.body.img}" alt="${task.body.title}"> 
        `;
        blogCarousel.append(carouselItem);
        
        const indicator = document.createElement('div');
        indicator.className = `indicator`;
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.append(indicator);
    });
    
    slides = document.querySelectorAll('.divCarousel');
    slideCount = slides.length;
    indicatorsContainer.classList.remove('hidden');
    
    updateCarousel();
}

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });
    
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });

    startAutoSlide()
}

async function loadBlogData() {
    showLoader();
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
        
        const response = await fetch(API_URL, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Нет данных для отображения');
        }
        
        carouselData = data;
        createCarousel(data);
        
        startAutoSlide();
        
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        
        let errorMessage = 'Произошла неизвестная ошибка';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Время ожидания запроса истекло. Проверьте подключение к интернету.';
        } else if (error.message.includes('HTTP ошибка')) {
            errorMessage = `Ошибка сервера: ${error.message}`;
        } else if (error.message.includes('Нет данных')) {
            errorMessage = error.message;
        } else if (error instanceof TypeError) {
            errorMessage = 'Ошибка сети. Проверьте подключение к интернету.';
        }
        
        showError(errorMessage);
        
        blogCarousel.innerHTML = `
            <div class="divCarousel active" style="text-align: center; padding: 50px;">
                <h3>Не удалось загрузить данные</h3>
                <p>${errorMessage}</p>
                <button class="erorr-button" onclick="loadBlogData()">
                    Попробовать снова
                </button>
            </div>
        `;
        
    } finally {
        hideLoader();
    }
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function showPreviousSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
}

function showNextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(showNextSlide, 3000); 
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    prevButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);
    
    loadBlogData();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPreviousSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    });
});

window.loadBlogData = loadBlogData;