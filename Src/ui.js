class MovieComponent{
    static variants = {
        default : {
            showImage: true,
            titleClass: 'text-gray-100 line-clamp-1 m-2 text-sm absolute bottom-0 z-20',
            year: 'text-sm text-gray-500',
            showInfo: true,
            image: 'w-full h-80 object-cover'

        },
        slider: {
            sliderHero: true,
            titleClass: 'text-gray-100 text-2xl md:text-6xl font-bebas',
            year: 'text-sm text-gray-100',
            showInfo: false,

        },
        moviesList : {
            titleClass: 'text-gray-100 line-clamp-1 m-2 absolute bottom-0 z-20',
            year: 'text-sm text-gray-500',
            image: 'w-full h-64',
            showImage: true,
            showInfo: true,
        }
    }
    static createCard(movie , options = {} , extraClass){
        const variantName = options.variant || 'default';
        const config = {...this.variants[variantName]}
        const card = document.createElement('div');
        const scoAge = document.querySelector('.scoAge');
        const title = document.createElement('p');


        card.className = `relative shadow-2xl p-2 ${extraClass}`;

        if(config.showImage){
            const img = document.createElement('img');
            img.src = movie.poster_url ?? '';
            img.className = `${config.image}`;
            card.appendChild(img);
        } 
        const info = document.createElement('div');
        const year = document.createElement('span');
        year.textContent = movie.year;
        year.className = config.year;
        info.className = 'flex justify-between';
        title.textContent = movie.title;
        title.className = config.titleClass;
        card.appendChild(title);

        if(config.showInfo){
            const rating = document.createElement('span');
            const overlay = document.createElement('div');
            overlay.className = 'absolute bottom-0 py-3 w-32 rounded-r-xl bg-gray-900 z-10';
            rating.textContent = movie.rating.score;
            rating.className = 'text-yellow-500 absolute text-xs top-2 m-2 left-2 font-bold bg-gray-950/70 p-2 rounded-xl';

            card.removeChild(title);
            card.append(overlay , rating);
        }
        
        
        
        if(config.sliderHero){
            const type = document.createElement('span');
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
            rowPanel.className = 'flex gap-2 items-center flex-wrap border-t border-gray-700 py-2'


            desc.textContent = movie.summary;
            desc.className = 'line-clamp-3 md:line-clamp-6 md:text-sm text-xs md:w-fit w-64';
            card.className = 'text-gray-100 flex flex-col gap-3 ml-5';
            type.innerHTML = movie.type === 'TV Series' 
            ? `<i class="fa-solid fa-tv text-gray-500"></i><span class="text-sm"> ${movie.type}</span>`
            : `<i class="fa-solid fa-clock text-green-200"></i><span class="text-sm"> ${movie.duration}</span>`
            country.innerHTML = `<i class="fa-solid fa-flag text-gray-500"></i><span class="text-sm"> ${movie.country[0]}</span>`;

            const refrenceBtns = document.createElement('div');
            const wishlistBtn = document.createElement('button');
            const viewDetailBtn = document.createElement('button');
            refrenceBtns.className = 'flex gap-2 hidden md:flex';
            wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Wishlist';
            wishlistBtn.className = 'border p-2 rounded-xl bg-purple-600/50 border-purple-500 w-48 hover:bg-inherit transition';
            viewDetailBtn.innerHTML = '<i class="fa-solid fa-file-lines"></i> View details';
            viewDetailBtn.className = 'border p-2 rounded-xl bg-purple-600/50 border-purple-500 hover:bg-inherit transition';

            refrenceBtns.append(wishlistBtn,viewDetailBtn);
            rowPanel.append(country,type);
            card.append(desc , rowPanel , refrenceBtns);
        }
        return card;
    }
}


export class Sliders {
    constructor (){
        this.headerSlider = document.querySelector('.headerSlider');
        this.stills = document.querySelector('.Stills');
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
        this.cleanObj = data.filter(get => get.isTrends && get.badges.length > 0 && get.backdrop_url.trim() !== '');
        this.renderSlide();
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
    renderMovieBadges(){
        const badges = this.currentObj.badges || [];
        const stillsCache = [];
        if (!badges || badges.length === 0) return '';

        const renderBadge = badges.slice(0,5).map (src => {
            return `<img src="${src}" class="cursor-pointer flex-none w-64 h-32 object-cover rounded-xl shadow-xl snap-center">`
        }).join('');
        return `
        <div class="relative hidden md:block">
        <h1 class="text-gray-100 text-2xl m-2 ml-4">Snaps</h1>

            <div class="SliderStills ml-5 flex gap-3 snap-x snap-mandatory no-scrollbar pb-8 items-center flex-row overflow-x-auto">
                ${renderBadge}
                <a href="#" class="flex flex-shrink-0 items-center justify-center border border-gray-700 bg-gray-950/50 w-64 h-32 object-cover rounded-xl shadow-xl snap-center">
                    <span class="text-3xl text-gray-500"><i class="fa-regular fa-images"></i> ${this.currentObj.badges.length}</span>
                </a>
            </div>
            
        </div>
        
        `;
    }
    renderTrendsSlider(){
        
        const sliderInfo = MovieComponent.createCard(this.currentObj , {variant: 'slider'} , 'w-full flex items-center gap-2');
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
                this.stills.innerHTML = this.renderMovieBadges();
                this.SliderHeroSection.innerHTML = '';
                this.renderTrendsSlider();
                this.headerSlider.style.opacity = 1;
            }

            
        }, 300);
    }
}

export class AdvancedSearch {
    constructor (){
        this.searchInput = document.getElementById('searchInput');
        this.searchResult = document.querySelector('.SearchResult');
        this.overlay = document.getElementById('search-glow');
        this.searchArr = [];

        this.searchInput.addEventListener('input' , () => {
            if(this.searchInput.value.length < 3){
                this.searchResult.innerHTML = '';
                return;
            };
            this.renderResult();
        });
    }
    init(data){
        this.searchArr = data;
    }
    search(){
        let cleanInput = this.searchInput.value.toLowerCase();
        return this.searchArr.filter(get => {
            let matchesTitle = get.title.toLowerCase().includes(cleanInput);
            return matchesTitle;
        });
    }
    getSearchResult(get){
        return `

                <div class="flex gap-3 p-3">
                    <img src="${get.poster_url}" class="w-16 rounded-md object-cover cursor-pointer">
                    <div class="flex flex-col">
                        <div>
                            <span class="md:text-xl"><i class="fa-solid fa-hashtag"></i> ${get.title}</span>
                            <span class="text-gray-500">(${get.year})</span>
                            <span><i class="fa-solid fa-user-shield text-xs text-gray-400"></i> ${get.ageRating}</span>
                        </div>
                        <span class="text-sm text-gray-500">${get.genres.join( ' - ' )}</span>
                        <div class="flex items-center justify-center w-fit">
                                <div class="flex items-center justify-center">
                                <span class="font-bold font-bold">${get.rating?.score ?? ''} </span>
                                <i class="fa-solid fa-star text-xs ml-1 text-yellow-500"></i>
                            </div>
                        </div>
                        <a href="movieDetail.html" class="text-sm text-blue-500 font-bold flex items-center">View Details <i class="fa-solid fa-angle-right text-xs ml-2"></i></a>
                    </div>
                    
                </div>
            `
    }
    renderResult(){
        let filtered = this.search();
        if(filtered.length === 0) {
            this.searchResult.innerHTML = '';
            return;
        };
        this.searchResult.innerHTML = filtered.map(get => {
            return this.getSearchResult(get);
        }).join('');
    }
}

export class PopularSection {
    constructor(){
        this.popularContainer = document.querySelector('.popular');
        this.populars = [];
        this.top10 = [];
    }
    getPopularData(data){
        this.populars = data.filter(only => only.isTrends);
        this.top10 = this.populars.slice(0 , 5);
        
        this.renderPopulars();
    }
    
    popularHtml(get){
        return `
        <div class="flex gap-2 text-gray-200 ">
                <img src="${get.poster_url}" class="w-24 object-cover">
                <div>
                    <span>${get.title}</span>
                
                </div>
            </div>
            `
    }
    renderPopulars(){
        this.popularContainer.innerHTML = this.top10
        .map(get => this.popularHtml(get))
        .join('');
    }
}
export class category {
    constructor (){
        this.categoryContainer = document.querySelector('.trends');
    }
    createCategorySection(data){
            let filters = data.filter(movie => movie.isTrends);
            if(filters.length < 5) return;

            const scrollBtns = document.createElement('div');
            scrollBtns.innerHTML = `
                    <button class="next hidden group-hover:block absolute top-1/2 z-10 right-5 text-2xl text-gray-100"><i class="fa-solid fa-angle-right"></i></button>
                    <button class="prev hidden group-hover:block absolute top-1/2 z-10 left-5 text-2xl text-gray-100"><i class="fa-solid fa-angle-left"></i></button>
                `
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'relative w-full group mx-2';

            contentWrapper.appendChild(scrollBtns);

            const scrollContent = document.createElement('div');
            scrollContent.className = 'flex overflow-x-scroll no-scrollbar gap-1 my-2';
            
            filters.forEach(get => {
                const movieCard = MovieComponent.createCard(get , {variant: 'default'} , 'w-48 flex flex-shrink-0');
                scrollContent.appendChild(movieCard);
            });
            contentWrapper.appendChild(scrollContent);
            this.categoryContainer.appendChild(contentWrapper);
            const categoryScrolls = new Scroller(scrollContent);
            scrollBtns.querySelector('.prev').addEventListener('click' , () => categoryScrolls.prevMovie());
            scrollBtns.querySelector('.next').addEventListener('click' , () => categoryScrolls.nextMovie());
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
activeSidebar();
activeSearch();

