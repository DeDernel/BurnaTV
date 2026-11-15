import { MovieComponent } from './components/movieCard.js';

export class Sliders {
    constructor (){
        this.sliderImage = document.querySelector('.slider-img');
        this.sliderDescription = document.querySelector('.slider-info-panel');
        this.sliderContainer = document.querySelector('.slider-container');
        this.paginationSlider = document.querySelector('.pagination-dots');

        if(!this.sliderImage || !this.sliderContainer) return;

        this.changeSliderTime = null;
        this.sliderMovieIndex = 0;
        this.trendingSliders = [];

        this.currentMovie;
    }

    swipeSlider(){
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.sliderContainer.addEventListener('pointerdown' , event => {
            if(event.pointerType === 'mouse') return;

            this.touchStartX = event.clientX;
            this.touchStartY = event.clientY;
        });
        this.sliderContainer.addEventListener('pointerup' , event => {
            if(event.pointerType === 'mouse') return;

            const touchEndX = event.clientX;
            const touchEndY = event.clientY;

            const diffX = touchEndX - this.touchStartX;
            const  diffY = touchEndY - this.touchStartY;

            if(Math.abs(diffX) < 50) return;
            if(Math.abs(diffX) < Math.abs(diffY)) return;

            if(diffX < 0){
                this.moveSlide(1);
            }else{
                this.moveSlide(-1)
            }
        });
    }

    navigateSlider(){
        this.sliderContainer.addEventListener('mouseover' , () => clearInterval(this.changeSliderTime));
        this.sliderContainer.addEventListener('mouseout' , () => this.startHeaderSlider());

        this.sliderContainer.addEventListener('click', event => {
            if (event.target.closest('.back')) {
                this.moveSlide(-1); 
            } else if (event.target.closest('.forward')) {
                this.moveSlide(1);
            }
        });
    }

    createDots(){
        this.paginationSlider.innerHTML = '';
        this.trendingSliders.forEach(get => {
            const span = document.createElement('span');
            if(get.id !== this.currentMovie.id){
                span.className = 'p-1 bg-gray-500 m-1 w-2 rounded-full transition-all duration-500 ease-in-out';
            }else{
                span.className = 'p-1 bg-violet-500 m-1 rounded-full w-8 transition-all duration-500 ease-in-out';
            }
            this.paginationSlider.appendChild(span);
        });
    }

    init(data){
        if (!data || data.length === 0) return;
        this.trendingSliders = data.filter(get => get.isTrending  && get.backdrop_url.trim() !== '').slice(0,5);
        clearInterval(this.changeSliderTime);

        this.renderSlider();
        this.navigateSlider();  
        this.swipeSlider();
    }

    moveSlide(direction) {
        if (this.trendingSliders.length === 0) return;
        
        this.sliderMovieIndex = (this.sliderMovieIndex + direction + this.trendingSliders.length) % this.trendingSliders.length;
        this.renderSlider();
        
        clearInterval(this.changeSliderTime);
        this.startHeaderSlider();
    }   

    startHeaderSlider() {
        clearInterval(this.changeSliderTime);
        this.changeSliderTime = setInterval(() => {
            this.moveSlide(1);
        }, 7000);
    }

    renderTrendsSlider(){
        const sliderInfo = MovieComponent.createCard(this.currentMovie , { variant: 'Slider' });
        this.sliderDescription.appendChild(sliderInfo);
    }

    renderSlider(){
        this.sliderImage.style.opacity = 0;

        setTimeout(() => {
            this.currentMovie = this.trendingSliders[this.sliderMovieIndex];
            
            if (!this.currentMovie || !this.currentMovie.backdrop_url) return;
            const img = new Image();
            img.src = this.currentMovie.backdrop_url;
            img.onload = () => {
                this.createDots()
                this.startHeaderSlider();
                this.sliderImage.src = this.currentMovie.backdrop_url || '';
                this.sliderDescription.innerHTML = '';
                this.renderTrendsSlider();
                this.sliderImage.style.opacity = 1;
            }
        }, 300);
    }
}
class Scroller{
    constructor (Scroll){
        this.Container = Scroll;
    }
    getScrollStep(){
        let getChildWidth = this.Container.firstElementChild;
        if(!getChildWidth) return;
    
        return getChildWidth.offsetWidth;
    }
    nextMovie(){
        this.Container.scrollBy({
            left: this.getScrollStep(),
            behavior: 'smooth'
        })
    }
    prevMovie(){
        this.Container.scrollBy({
            left: -this.getScrollStep(),
            behavior: 'smooth'
        })
    }
}

(function initNavigation(){

    function activeSidebar(){
        const SideBar = document.querySelector('.SideBar');
        const openMenu = document.querySelector('.openMenu');
        const closeMenu = document.querySelector('.closeMenu');
        const SidebarOverlay = document.querySelector('.SidebarOverlay');


        if (!openMenu || !closeMenu) return;
        openMenu.addEventListener('click' , () => {
            SideBar.classList.replace('ClosedSidebar' , 'OpenSidebar');
            SidebarOverlay.classList.replace('hidden' , 'block');
        });
        
        closeMenu.addEventListener('click' , () => {
            setTimeout(() => {
                SideBar.classList.add('ClosedSidebar');
                SidebarOverlay.classList.replace('block' , 'hidden');
            },100);
            SideBar.classList.remove('OpenSidebar');
            
        });
    }
    activeSidebar();
})();


































