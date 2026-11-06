export class MovieComponent{
    static variants = {
        default : {
            tag: 'a',
            showImage: true,
            titleClass: 'text-gray-100 line-clamp-1 text-sm',
            releaseDate: 'text-xs text-gray-500',
            image: 'w-full h-64 object-cover rounded-lg mb-2'
        },
        sliderPanel: {
            tag: 'div',
            sliderHero: true,
            titleClass: 'text-gray-100 text-3xl line-clamp-1 md:text-6xl font-bebas',
            releaseDate: 'text-sm text-gray-100',
        },

    }
    static createCard(movie , options = {} , extraClass){
        const variantName = options.variant || 'default';
        const config = {...this.variants[variantName]}
        
        const scoAge = document.querySelector('.scoAge');
        const title = document.createElement('p');


        const card = document.createElement(config.tag);
        if(config.tag === 'a'){
            card.href = `movieDetail.html?id=${movie.id}`;
        }
        card.className = `p-2 bg-gray-900 rounded ${extraClass}`;

        title.textContent = movie.title;
        title.className = config.titleClass;

        
        

        const year = document.createElement('span');
        year.textContent = `(${movie.releaseDate})`;
        year.className = config.releaseDate;
        
        


        if(config.showImage){
            const img = document.createElement('img');
            const score = document.createElement('div');
            const info = document.createElement('div');
            const navBtns = document.createElement('div');
                navBtns.className = 'absolute top-5 left-5 flex flex-col gap-2 text-xl';
                navBtns.innerHTML = `
                    <button class="w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-purple-600 transition-all duration-300">
                    <i class="fa-solid fa-plus text-sm"></i>
                    </button>
                    <button class="w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-purple-600 transition-all duration-300">
                    <i class="fa-solid fa-share text-sm"></i>
                    </button>
                `
            
            score.className = 'my-2';
            score.innerHTML = `<span class="p-1 text-sm bg-yellow-500 font-Orbitron rounded">IMDB</span>
                                <span class="text-xl text-yellow-500">${movie.rating.score ?? ''}<span class="text-sm text-gray-500"> / 10</span></span>
                                `
            img.src = movie.poster_url ?? '';
            img.className = `${config.image}`;
            
            info.append(title , year);
            card.append(img , info , score , navBtns);
        }
        
        if(config.sliderHero){
            card.appendChild(title);
            const genres = document.createElement('span');
            const country = document.createElement('span');
            const desc = document.createElement('span');

            scoAge.innerHTML = 
            `
                <div class="flex flex-col items-center gap-1 text-xl md:text-2xl">
                    <span class="text-gray-100 border-b">${movie.minAge}</span>
                    <i class="fa-solid fa-user-shield text-blue-300"></i>
                </div>
                
                <div class="flex flex-col items-center gap-1 text-xl md:text-2xl">
                    <span class="text-yellow-500 border-b">${movie.rating.score}</span>
                    <i class="fa-solid fa-star text-yellow-500"></i>
                </div>
            `
            const rowPanel = document.createElement('div');
            rowPanel.className = 'flex flex-col gap-2 flex-wrap border-t border-purple-600 rounded-xl py-2'


            desc.textContent = movie.summary;
            desc.className = 'line-clamp-3 md:line-clamp-6 md:text-sm text-sm md:w-fit w-96';
            card.className = 'text-gray-100 flex flex-col gap-3 ml-5';
            genres.innerHTML = `<span class="text-sm"><span class="bg-gray-700/50 p-1 px-2 rounded-xl">Genre</span> ${movie.genres.join(' / ')}</span>`;
            const countryText = document.createElement('span');
            countryText.className = 'bg-gray-700/50 p-1 px-2 rounded-xl';
            countryText.textContent = 'Origin';
            country.appendChild(countryText);
            movie.countries.forEach(get => {
                const img = document.createElement('img');
                img.src = get.flag;
                img.className = 'ml-1'
                const span = document.createElement('span');
                span.textContent = get.name;
                country.append(img , span);
            });
            country.className = 'flex flex-wrap items-center leading-none gap-1 text-sm';

            const refrenceBtns = document.createElement('div');
            const wishlistBtn = document.createElement('button');
            const viewDetailBtn = document.createElement('button');
            refrenceBtns.className = 'flex gap-2 md:flex';
            wishlistBtn.innerHTML = '<span class="flex items-center justify-center gap-2">Watchlist <i class="fa-solid fa-plus"></i></span>';
            wishlistBtn.className = 'border p-2 rounded-xl bg-purple-700/70 border-purple-500 w-32 hover:bg-inherit transition';
            viewDetailBtn.innerHTML = '<span class="flex items-center justify-center gap-2">Play <i class="fa-solid fa-play"></i></span>';
            viewDetailBtn.className = 'border p-2 rounded-xl bg-purple-700/70 border-purple-500 hover:bg-inherit transition';

            refrenceBtns.append(wishlistBtn,viewDetailBtn);
            rowPanel.append(country,genres);
            card.append(desc , rowPanel , refrenceBtns);
        }
        return card;
    }
}


export class Sliders {
    constructor (){
        this.headerSlider = document.querySelector('.headerSlider');
        this.SliderHeroSection = document.querySelector('.SliderHeroSection');
        this.imgLoader = document.querySelector('.imgLoader');
        this.topSlider = document.querySelector('.topSlider');
        
        this.headerSlideStatus = null;
        this.SliderObjIndex = 0;
        this.cleanObj = [];
        this.currentObj;

        this.topSlider.addEventListener('mouseover' , () => clearInterval(this.headerSlideStatus));
        this.topSlider.addEventListener('mouseout' , () => this.startHeaderSlider());
        

        this.imgLoader.addEventListener('click', event => {
            if (event.target.closest('.back')) {
                this.moveSlide(-1); 
            } else if (event.target.closest('.forward')) {
                this.moveSlide(1);
            }
        });
    }
    
    init(data){
        if (!data || data.length === 0) return;
        this.cleanObj = data.filter(get => get.isTrending && get.badges.length > 0 && get.backdrop_url.trim() !== '');
        this.renderSlide();

        clearInterval(this.headerSlideStatus);
        this.startHeaderSlider();
    }

    moveSlide(direction) {
        if (this.cleanObj.length === 0) return;
        
        this.SliderObjIndex = (this.SliderObjIndex + direction + this.cleanObj.length) % this.cleanObj.length;
        this.renderSlide();
        
        clearInterval(this.headerSlideStatus);
        this.startHeaderSlider();
    }   

    startHeaderSlider() {
        clearInterval(this.headerSlideStatus);
        this.headerSlideStatus = setInterval(() => {
            this.moveSlide(1);
        }, 5500);
    }
    renderTrendsSlider(){
        const sliderInfo = MovieComponent.createCard(this.currentObj , {variant: 'sliderPanel'} , 'w-full flex items-center gap-2');
        this.SliderHeroSection.appendChild(sliderInfo);
    }
    renderSlide(){
        this.headerSlider.style.opacity = 0;

        setTimeout(() => {
            this.currentObj = this.cleanObj[this.SliderObjIndex];
            
            if (!this.currentObj || !this.currentObj.backdrop_url) return;
            const img = new Image();
            img.src = this.currentObj.backdrop_url;
            img.onload = () => {
                this.headerSlider.src = this.currentObj.backdrop_url;
                this.SliderHeroSection.innerHTML = '';
                this.renderTrendsSlider();
                this.headerSlider.style.opacity = 1;
            }
        }, 300);
    }
}

export class MovieRow {
    constructor (currentContainer , key){
        this.container = document.querySelector(currentContainer);
        if(!this.container) return;


        this.moviesData = [];
        this.filterType = key;
        
    }
    init(data){
        this.moviesData = data;
        this.createRowHTML();
    }
    filterRow(type){
        const today = new Date();

        const filteredData = (days) => {
            const limitDate = new Date();
            limitDate.setDate(today.getDate() - days);
            
            return this.moviesData.filter(get => {
                const movieDate = new Date(get.releaseDate);
                return movieDate >= limitDate;
            });
        }

        switch(type){
            case 'week': return filteredData(40);
            case 'new': return filteredData(20);
            default: this.moviesData;
        }
    }
    createRowHTML(){
            let rowContent = this.filterRow(this.filterType);
            if(rowContent.length <= 0) return;


            const scrollBtns = document.createElement('div');
            scrollBtns.innerHTML = `
                    <button class="next hidden group-hover:block absolute top-1/2 z-10 right-5 text-2xl text-gray-100"><i class="fa-solid fa-angle-right"></i></button>
                    <button class="prev hidden group-hover:block absolute top-1/2 z-10 left-5 text-2xl text-gray-100"><i class="fa-solid fa-angle-left"></i></button>
                `
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'relative w-full group mx-2';

            contentWrapper.appendChild(scrollBtns);

            const scrollContent = document.createElement('div');
            scrollContent.className = 'flex gap-2 overflow-x-scroll no-scrollbar my-2';
            
            rowContent.forEach(get => {
                const movieCard = MovieComponent.createCard(get , {variant: 'default'} , 'w-48 relative flex flex-col flex-shrink-0');
                scrollContent.appendChild(movieCard);
            });
            const overlay = document.createElement('div');
            overlay.className = 'absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent pointer-events-none'
            contentWrapper.appendChild(scrollContent);
            this.container.append(contentWrapper , overlay);
            const rowScroll = new Scroller(scrollContent);
            scrollBtns.querySelector('.prev').addEventListener('click' , () => rowScroll.prevMovie());
            scrollBtns.querySelector('.next').addEventListener('click' , () => rowScroll.nextMovie());
    }
}

export class Casts{
    constructor(){
        this.casts = document.querySelector('.casts');
        this.CastsScroller = new Scroller(this.casts)
        this.castsRefrence = document.querySelector('.castsRefrence');
        document.querySelector('.nextRight').addEventListener('click' , () => this.CastsScroller.nextMovie());
        document.querySelector('.nextleft').addEventListener('click' , () => this.CastsScroller.prevMovie());
        this.allCasts = [];
        this.limitControlIndex = 20;
        this.loadTime = null;

        this.casts.addEventListener('click' , event => {
            if(event.target.closest('.moreCast')){

                clearTimeout(this.loadTime);
                this.loadTime = setTimeout(() => {
                    this.limitControlIndex += 10;
                    this.initCasts(this.allCasts.slice(0 , this.limitControlIndex));
                },300);
            }
        });
    }
    init(Casts){
        this.allCasts = Casts.flatMap(get => get.cast);
        this.initCasts(this.allCasts.slice(0 , this.limitControlIndex));
    }
    initCasts(limitedCasts){
        this.castsRefrence.innerHTML = `
            <div class="flex">
                <div>
                    <i class="fa-solid fa-users text-blue-400"></i> Casts 
                    <span class="text-sm text-gray-300">(+${limitedCasts.length})</span>
                </div>
            </div>
                `;
        this.casts.innerHTML = limitedCasts.map(C => {
            return `
                <div class="flex flex-col items-center flex-shrink-0 snap-start">
                    <div class="flex flex-col items-center flex-shrink-0 snap-start">
            ${C.photo 
                ? `<img src="${C.photo}" class="w-24 h-24 rounded-full object-cover">` 
                : `<div class="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    <span class="text-xs text-gray-500">No Image</span>
                </div>`
            }
                <h1 class="text-gray-400">${C.name ?? ''}</h1>
                </div>
            </div>
            `
        }).join('');
        this.casts.innerHTML +=         
        `
        <a class="flex cursor-pointer flex-col items-center flex-shrink-0 snap-start mr-12 justify-center text-yellow-500">
                <button class="mt-2 moreCast">View all</button>
                <i class="fa-solid fa-arrow-right-long text-xl"></i>
        </a>`;
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
function activeSidebar(){
    const SideBar = document.querySelector('.SideBar');
    const openMenu = document.querySelector('.openMenu');
    if (!openMenu) return;
    openMenu.addEventListener('click' , () => {
        SideBar.classList.replace('ClosedSidebar' , 'openningMenu');
    });
    const closeMenu = document.querySelector('.closeMenu');
    closeMenu.addEventListener('click' , () => {
        SideBar.classList.replace('openningMenu' , 'ClosedSidebar');
    });
}
function activeSearch(){
    const activateSearch = document.querySelector('.activateSearch');
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.querySelector('.searchBox');
    let timing = null;
    if(!activateSearch) return;
    activateSearch.addEventListener('click' , (e) => {
        e.preventDefault();
        searchInput.className = '';
        searchInput.classList.add('ActiveSearch');
        timing = setTimeout(() => {
            searchInput.classList.add('SinputAnim');
            searchBox.classList.add('border');
        },200);
    });
}
function dropDowns(btn , container){
    let dropDownTiming = null;
    
    const dropDownBtn = document.querySelector(btn);
    const dropDownContainer = document.querySelector(container);
    if (!dropDownBtn || !dropDownContainer) {
        return; 
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

dropDowns('.activeMoviesNav' , '.moviesNav');
dropDowns('.activeSeriesNav' , '.seriesNav');
activeSidebar();
activeSearch();

