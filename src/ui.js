import { MovieComponent } from './components/movieCard.js';

export class Sliders {
    constructor (){
        this.sliderImage = document.querySelector('.slider-img');
        this.SliderHeroSection = document.querySelector('.slider-info-panel');

        this.sliderContainer = document.querySelector('.slider-container');
        this.paginationSlider = document.querySelector('.pagination-dots');

        this.headerSlideStatus = null;
        this.SliderObjIndex = 0;
        this.trendingSliders = [];

        this.currentObj;

        this.touchStartX = 0;
        this.touchStartY = 0;

        this.sliderContainer.addEventListener('mouseover' , () => clearInterval(this.headerSlideStatus));
        this.sliderContainer.addEventListener('mouseout' , () => this.startHeaderSlider());
        
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
            if(get.title !== this.currentObj.title){
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
        this.renderSlide();

        clearInterval(this.headerSlideStatus);
    }

    moveSlide(direction) {
        if (this.trendingSliders.length === 0) return;
        
        this.SliderObjIndex = (this.SliderObjIndex + direction + this.trendingSliders.length) % this.trendingSliders.length;
        this.renderSlide();
        
        clearInterval(this.headerSlideStatus);
        this.startHeaderSlider();
    }   

    startHeaderSlider() {
        clearInterval(this.headerSlideStatus);
        this.headerSlideStatus = setInterval(() => {
            this.moveSlide(1);
        }, 7000);
    }
    renderTrendsSlider(){
        const sliderInfo = MovieComponent.createCard(this.currentObj , {variant: 'sliderPanel'} , 'w-full flex items-center gap-2');
        this.SliderHeroSection.appendChild(sliderInfo);
    }
    renderSlide(){
        this.sliderImage.style.opacity = 0;

        setTimeout(() => {
            this.currentObj = this.trendingSliders[this.SliderObjIndex];
            
            if (!this.currentObj || !this.currentObj.backdrop_url) return;
            const img = new Image();
            img.src = this.currentObj.backdrop_url;
            img.onload = () => {
                this.createDots()
                this.startHeaderSlider();
                this.sliderImage.src = this.currentObj.backdrop_url;
                this.SliderHeroSection.innerHTML = '';
                this.renderTrendsSlider();
                this.sliderImage.style.opacity = 1;
            }
        }, 300);
    }
}

export class MovieRow {
    constructor (){
        this.container = document.querySelector('.sections');
        if(!this.container) return;


        this.moviesData = [];


        this.sections = [
            { header: 'Trending Now', subName: 'The hottest titles right now' , type: 'trends'} ,
            { header: 'Coming Soon' , subName: 'Don’t miss what’s next' , type: 'upcoming'},
            { header: 'New Releases', subName: 'Freshly added to our collection', type: 'new'},
        ]
        
    }
    init(data){
        this.moviesData = data;
        this.createRowHTML();
    }
    createRowHTML(){
        const today = new Date();
        
        this.type = 
            {
                trends: this.moviesData.filter(movie => movie.isTrending),
                upcoming: this.moviesData.filter(movie => movie.status === 'upcoming'),
                new: this.moviesData.filter(movie => {
                    const movieDate = new Date(movie.releaseDate);
                    if(isNaN(movieDate)) return false;
                    if(movieDate > today) return false;
                    const limit = (today.getFullYear() - movieDate.getFullYear()) * 12 + (today.getMonth() - movieDate.getMonth());
                    if (limit < 3 && movie.rating.score !== 0) return true;
                })
            },
            
        


        this.sections.forEach(field => {

            const section = document.createElement('section');
            section.className = 'relative';
            section.className = 'flex flex-col gap-3 py-2 px-4 bg-gray-900';
            const headerBox = document.createElement('div');
            const span = document.createElement('span');
            span.textContent = ' / ';
            span.className = 'text-xl text-violet-500 font-bold';
            const header = document.createElement('h3');
            header.className = 'text-white';
            header.textContent = field.header;
            const list = document.createElement('div');
            list.className = 'horiz-movie-list flex overflow-x-auto relative no-scrollbar';

            this.type[field.type].forEach(get => {
                const movie = MovieComponent.createCard(get , {variant: 'default'} , 'relative w-48 flex-shrink-0 group');
                list.appendChild(movie);
            });

            const wrapper = document.createElement('div');
            wrapper.className = 'flex justify-between';
            const view = document.createElement('a');
            view.href = '';
            view.textContent = 'View All';
            view.className = 'text-violet-500';
            const subTitle = document.createElement('span');
            subTitle.textContent = field.subName;
            subTitle.className = 'text-gray-500 text-xs';
            const headerWrapper = document.createElement('div');
            headerWrapper.append(span , header);
            headerWrapper.className = 'flex gap-2';

            const scrollBtns = document.createElement('div');
            scrollBtns.className = 'pointer-events-none absolute text-white text-2xl absolute inset-0 z-10 flex items-center justify-between px-2'; 

            const leftBtn = document.createElement('button');
            const rightBtn = document.createElement('button');
            leftBtn.className = 'absolute top-1/2 left-5 prev';
            rightBtn.className = 'absolute top-1/2 right-5 next';
            rightBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
            leftBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'relative';
            
            contentWrapper.append(list , scrollBtns);
            scrollBtns.append(rightBtn , leftBtn);
            wrapper.append(headerWrapper , view);
            headerBox.append(wrapper , subTitle);
            section.append(headerBox , contentWrapper);
            this.container.appendChild(section);


            const watchScrollBtns = () => {
                setTimeout(() => {
                    if(list.scrollWidth > contentWrapper.clientWidth){
                        scrollBtns.classList.remove('hidden');
                    }else{
                        scrollBtns.classList.add('hidden');
                    }
                },50);
            }
            const resObs = new ResizeObserver(() => {
                watchScrollBtns();
            });
            resObs.observe(contentWrapper);


            const scroll = new Scroller(list);
            section.addEventListener('click' , event => {
                if(event.target.closest('.prev')){
                    scroll.prevMovie();
                }
                if(event.target.closest('.next')){
                    scroll.nextMovie();
                }
            });
        });

    }
}

// export class Casts{
//     constructor(){
//         this.casts = document.querySelector('.casts');
//         this.CastsScroller = new Scroller(this.casts)
//         this.castsRefrence = document.querySelector('.castsRefrence');
//         document.querySelector('.nextRight').addEventListener('click' , () => this.CastsScroller.nextMovie());
//         document.querySelector('.nextleft').addEventListener('click' , () => this.CastsScroller.prevMovie());
//         this.allCasts = [];
//         this.limitControlIndex = 20;
//         this.loadTime = null;

//         this.casts.addEventListener('click' , event => {
//             if(event.target.closest('.moreCast')){

//                 clearTimeout(this.loadTime);
//                 this.loadTime = setTimeout(() => {
//                     this.limitControlIndex += 10;
//                     this.initCasts(this.allCasts.slice(0 , this.limitControlIndex));
//                 },300);
//             }
//         });
//     }
//     init(Casts){
//         if(!Casts || Casts.length === 0) return;
//         this.allCasts = Casts.flatMap(get => get.cast);
//         this.initCasts(this.allCasts.slice(0 , this.limitControlIndex));
//     }
//     initCasts(limitedCasts){
//         this.castsRefrence.innerHTML = `
//             <div class="flex">
//                 <div>
//                     <i class="fa-solid fa-users text-blue-400"></i> Casts 
//                     <span class="text-sm text-gray-300">(+${limitedCasts.length})</span>
//                 </div>
//             </div>
//                 `;
//         this.casts.innerHTML = limitedCasts.map(C => {
//             return `
//                 <div class="flex flex-col items-center flex-shrink-0 snap-start">
//                     <div class="flex flex-col items-center flex-shrink-0 snap-start">
//             ${C.photo 
//                 ? `<img src="${C.photo}" class="w-24 h-24 rounded-full object-cover">` 
//                 : `<div class="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
//                     <span class="text-xs text-gray-500">No Image</span>
//                 </div>`
//             }
//                 <h1 class="text-gray-400">${C.name ?? ''}</h1>
//                 </div>
//             </div>
//             `
//         }).join('');
//         this.casts.innerHTML +=         
//         `
//         <a class="flex cursor-pointer flex-col items-center flex-shrink-0 snap-start mr-12 justify-center text-yellow-500">
//                 <button class="mt-2 moreCast">View all</button>
//                 <i class="fa-solid fa-arrow-right-long text-xl"></i>
//         </a>`;
//     }
// }

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

        if (!openMenu || !closeMenu) return;
        openMenu.addEventListener('click' , () => {
            SideBar.classList.replace('ClosedSidebar' , 'OpenSidebar');
        });
        
        closeMenu.addEventListener('click' , () => {
            SideBar.classList.replace('OpenSidebar' , 'ClosedSidebar');
        });
    }
    function setupDropdown(btn , container){
        const dropDownBtn = document.querySelector(btn);
        const dropDownContainer = document.querySelector(container);
        
        if (!dropDownBtn || !dropDownContainer){
            return
        } 
        const arrow = dropDownBtn.querySelector('.arrow');
        
        dropDownBtn.addEventListener('click' , () => {
            const isOpen = dropDownContainer.classList.contains('openDropdown');
    
            if(!isOpen) {
                dropDownContainer.classList.add('openDropdown');
                dropDownContainer.classList.remove('closeAnim');
                arrow.className = 'fa-solid fa-angle-up mr-5 arrow';
                dropDownContainer.classList.add('openAnim');
            }else {
                dropDownContainer.classList.remove('openAnim');
                arrow.className = 'fa-solid fa-angle-down mr-5 arrow';
                dropDownContainer.classList.add('closeAnim');
    
                setTimeout(() => {
                    dropDownContainer.classList.remove('openDropdown');
                }, 500);
            }
    
        });
    }
    setupDropdown('.activeMoviesNav' , '.moviesNav');
    setupDropdown('.activeSeriesNav' , '.seriesNav');
    activeSidebar();
})();


