class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000;
        
        this.init();
    }
    
    async init() {
        await this.fetchImages();
        this.renderSlides();
        this.renderIndicators();
        this.setupEventListeners();
        this.startAutoSlide();
    }
    
    async fetchImages() {
        try {
            const response = await fetch('https://sotbitfront.netlify.app/.netlify/functions/api');
            const data = await response.json();
            
            this.slides = data.map(item => item.body.img);
            this.totalSlides = this.slides.length;
        } catch (error) {
            console.error('Ошибка загрузки изображений:', error);
        }
    }
    
    renderSlides() {
        const slider = document.createElement('div');
        slider.className = 'intro__slider';
        
        this.slides.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'intro__slide';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Slide ${index + 1}`;
            img.className = 'intro__image';
            img.loading = 'lazy';
            
            slide.append(img);
            slider.append(slide);
        });
        
        const container = document.querySelector('.intro__container');
        container.prepend(slider, container.firstChild);
        this.sliderElement = slider;
    }
    
    renderIndicators() {
        const circlesContainer = document.querySelector('.intro__circles');
        circlesContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const circle = document.createElement('button');
            circle.className = `intro__circle ${i === 0 ? 'active' : ''}`;
            circle.addEventListener('click', () => this.goToSlide(i));
            circlesContainer.append(circle);
        }
    }
    
    setupEventListeners() {
        const prevBtn = document.querySelector('.intro__arrow-left');
        const nextBtn = document.querySelector('.intro__arrow-right');
        
        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.sliderElement.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.sliderElement.addEventListener('mouseleave', () => this.startAutoSlide());
                
        this.setupSwipe();
    }
    
    setupSwipe() {
        let startX = 0;
        let endX = 0;
        
        this.sliderElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoSlide();
            e.preventDefault();
        });
        
        this.sliderElement.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
            this.startAutoSlide();
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    updateSlide() {
        const translateX = -this.currentSlide * 100;
        this.sliderElement.style.transform = `translateX(${translateX}%)`;
        this.updateActiveSlide();
        
        this.startAutoSlide();
    }
    
    updateActiveSlide() {
        const circles = document.querySelectorAll('.intro__circle');
        circles.forEach((circle, index) => {
            circle.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});