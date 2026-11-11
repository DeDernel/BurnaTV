import { MovieComponent } from "./components/movieCard.js";


export class MoviesPage{
    constructor(FilterClass){
        this.param = new window.URLSearchParams(window.location.search);
        this.filterLogic = FilterClass;

        // this.filterLogic.currentFilterStatus.type = this.param.get('type');
        // this.filterLogic.currentFilterStatus.filter = this.param.get('filter');

        this.allContainer = document.querySelector('.allMS');
        this.movies = [];
        
        
        // CreateDefaultFilterTabs
        this.RFContainer = document.querySelector('.recomendedFilters');
        this.filterTabs = [
            { label: 'All',         value: 'all',      icon: 'fa-layer-group text-xs'   },
            { label: 'New',         value: 'new',      icon: 'fa-certificate text-xs'   },
            { label: 'Trending',    value: 'trending',   icon: 'fa-arrow-trend-up text-xs'},
            { label: 'Top Rated',   value: 'topRated', icon: 'fa-regular fa-star'},
            { label: 'Coming Soon', value: 'upcoming', icon: 'fa-calendar-plus text-xs' },
          ];

          this.RFContainer.addEventListener('click' , event => {
                const getClickedTab = event.target.closest('li');
                if(!getClickedTab) return;
                const tabValue = getClickedTab.dataset.value;

                this.RFContainer.querySelectorAll('li').forEach(rm => rm.classList.remove('active-tab'));
                getClickedTab.classList.add('active-tab');
                
                this.filterLogic.setFilter('' , tabValue);
                this.filterLogic.applyFilter(this.filterLogic.currentFilterStatus);
          });
          
        
        // CreateDefaultSearchOptions
        this.RSConatiner = document.querySelector('.searchSuggestions');
        this.searchInput = document.getElementById('searchInput');
        this.searchTimer = null;

        this.searchInput.addEventListener('input' , () => {
            if(this.searchInput.value.length === 0){
                this.RSConatiner.classList.add('hidden');
            }else{
                this.RSConatiner.classList.remove('hidden');
            }
            this.CreateDefaultSearchOptions();
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.setSearch(this.searchInput.value);
            },450);
            
        });

        this.RSConatiner.addEventListener('click' , event => {
            const getClickedSearch = event.target.closest('li');
            if(!getClickedSearch) return;
            this.RSConatiner.classList.add('hidden');
            const txtValue = getClickedSearch.textContent;
            this.setSearch(txtValue);
            this.searchInput.value = txtValue
        });



        // CreateAdvancedSearchOptions
        this.filterCount = document.querySelector('.filterCount');
        this.container = document.querySelector('.FilterDropDowns');
        this.ActiveFilterSection = document.querySelector('.toggleFilter');
        this.advancedFilters = document.querySelector('.advancedFilters');
        this.activeFilters = document.querySelector('.activeFilters');

        
        
        this.dropDowns = [
            {name: 'Media'   , value: 'Media' , icon: 'fa-regular fa-calendar text-sm w-4 text-violet-500'},
            {name: 'Year'   , value: 'Year' , icon: 'fa-regular fa-calendar text-sm w-4 text-violet-500'},
            {name: 'Genre'  , value: 'Genre' , icon: 'fa-solid fa-masks-theater text-sm w-4 text-violet-500'},
            {name: 'Rate'   , value: 'Rate' , icon: 'fa-solid fa-star text-sm w-4 text-violet-500'},
            {name: 'Age'    , value: 'Age' , icon: 'fa-solid fa-people-group text-sm w-4 text-violet-500'},
            {name: 'Country', value: 'Country' , icon: 'fa-solid fa-earth-europe text-sm w-4 text-violet-500'},
        ]
        this.container.addEventListener('click' , event => {
            const li = event.target.closest('li');
            if(!li) return;
            const list = li.closest('ul');
            if(!list) return;

            const box = list.closest('.section');
            const btn = box.querySelector('button');

            const optValue = btn.textContent = li.textContent;
            const selectedSection = box.dataset.section;
            
            console.log(optValue + selectedSection);
            this.filterLogic.setFilter(selectedSection,optValue)
        });
    }
    setSearch(value){
        let searchValue = value.trim().toLowerCase();
        this.filterLogic.currentFilterStatus.search = searchValue;
        this.filterLogic.setFilter('SearchBox' , searchValue);
        this.filterLogic.applyFilter(this.filterLogic.currentFilterStatus);
    }
    CreateDefaultSearchOptions(){
        this.RSConatiner.innerHTML = '';
        this.movies.filter(get => get.title.toLowerCase().includes(this.searchInput.value.toLowerCase())).slice(0,5).forEach(search => {
            const box = document.createElement('li');
            const searchRecomend = document.createElement('span');
            const i = document.createElement('i');
            i.className = 'fa-solid fa-magnifying-glass';
            searchRecomend.textContent = search.title;
            box.className = 'flex items-center rounded-xl gap-3 border-b border-gray-500 last:border-b-0 px-3 py-3 text-gray-300 text-sm cursor-pointer hover:bg-gray-700/70 transition-colors';
            box.append(i , searchRecomend);
            this.RSConatiner.append(box);
        });
    };

    CreateDefaultFilterTabs(){
        this.filterTabs.forEach(item => {
            const Tab = document.createElement('li');
            Tab.dataset.value = item.value;
            Tab.className = 'flex items-center gap-1.5 border border-gray-600 text-xs p-3 rounded-lg text-gray-200 hover:border-violet-200 hover:text-white transition-colors cursor-pointer';

            const i = document.createElement('i');
            i.className = `fa-solid ${item.icon} -translate-y-px text-gray-100`;
            const span = document.createElement('span');
            span.textContent = item.label;
            Tab.append(i , span);
            this.RFContainer.append(Tab);
        });
    }

    CreateAdvancedSearchOptions(){
        const extract = {
            'Media'   : [...new Set(this.movies.map(get => get.mediaType))],
            'Year'    : [...new Set(this.movies.flatMap(get => new Date(get.releaseDate).getFullYear()).sort((a , b) => b - a))],
            'Genre'   : [...new Set(this.movies.flatMap(get => get.genres))],
            'Rate'    : [...new Set(this.movies.map(get => get.rating.score.toFixed(0)))],
            'Age'     : [...new Set(this.movies.map(movie => movie.minAge).sort())],
            'Country' : [...new Set(this.movies.flatMap(movie => movie.countries).map(get => get.name).sort())]
        }
        this.dropDowns.forEach(field => {

            const box = document.createElement('div');
            const header = document.createElement('div');
            box.dataset.section = field.value;
        
            const div1 = document.createElement('div');
            const icon = document.createElement('i');
            const btn = document.createElement('button');
        
            const arrow = document.createElement('i');
            const list = document.createElement('ul');
        
            arrow.className = 'fa-solid fa-angle-down text-sm text-gray-400 transition-transform duration-300';
        
            box.dataset.section = field.value;
        
            icon.className = `${field.icon} `;
        
            btn.textContent = field.name;
            btn.className = 'text-sm font-semibold tracking-wide text-gray-300 transition-colors duration-300';
        
            div1.className = 'flex items-center justify-between p-2 cursor-pointer select-none transition-all duration-300';
        
            list.className = 'hidden border-t border-gray-700/60 bg-gray-950/40 p-2 space-y-1';
        
            box.className = `
            section 
            bg-gray-700/50 
            rounded-xl
            py-1
            `;
        
            extract[field.value].forEach(get => {
                const li = document.createElement('li');
        
                li.textContent = get;
        
                li.className = 'text-sm text-gray-400 list-none rounded-lg px-4 py-2 cursor-pointer transition-all duration-200 border-b border-purple-600 hover:bg-gray-800 hover:text-white hover:translate-x-1';
                
                list.appendChild(li);
            });
        
            header.className = 'flex items-center gap-3';
        
            header.append(icon, btn);
            div1.append(header, arrow);
            box.append(div1, list);
        
            this.container.appendChild(box);
            this.filterCount.textContent = `filters ${this.container.querySelectorAll('.section').length}`;
        
            let isOpen = false;
        
            box.addEventListener('click', event => {
                if(!isOpen){
                    isOpen = true;
                    list.classList.remove('hidden');
                    arrow.classList.add('rotate-180');
                }else{
                    isOpen = false;
                    list.classList.add('hidden');
                    arrow.classList.remove('rotate-180');
                }
            });
        });
    }

    
    init(moviesData){
        this.movies = moviesData;
        this.CreateDefaultSearchOptions()
        this.CreateDefaultFilterTabs();
        this.CreateAdvancedSearchOptions();
    }
}


export class FilterOperation{
    constructor(){
        this.allContainer = document.querySelector('.allMS');
        this.searchBtn = document.querySelector('.StartSeach');
        this.resetSearch = document.querySelector('.resetSearch');
        this.currentFilterStatus = {
                type: null, filter: null, search: null, 
                year: null, age: null, genre: null,
                rate: null, country: null
            };
        this.data = [];
        this.timer =  null;

        this.searchBtn.addEventListener('click' , () => {
            this.applyFilter(this.currentFilterStatus);
        });
        this.resetSearch.addEventListener('click' , () => {
            this.clearUI();
        });
    }
    defaultStatus(){
        return {
            type: null, filter: null, search: null, 
            year: null, age: null, genre: null,
            rate: null, country: null
        }
    }
    clearUI(){
        this.currentFilterStatus = this.defaultStatus();
        document.querySelectorAll('.FilterDropDowns .section').forEach(box => {
            const btn = box.querySelector('button');
            btn.textContent = box.dataset.section;
        });
        document.querySelectorAll('.recomendedFilters li').forEach(rm => rm.classList.remove('active-tab'));
        this.renderMovies();

    }
    setFilter(section , option){
        let list = this.data;
        if(section === 'Year') this.currentFilterStatus.year = option;
        else if(section === 'Genre') this.currentFilterStatus.genre = option;  
        else if(section === 'Age') this.currentFilterStatus.age = option;
        else if(section === 'Country') this.currentFilterStatus.country = option;
        else if(section === 'Media') this.currentFilterStatus.type = option;
        else if(section === 'Rate') this.currentFilterStatus.rate = option;

        else if (section === 'SearchBox'){
            this.currentFilterStatus.search = option;
        }
        
        else if(
           option === 'new'
        || option === 'trending'
        || option === 'topRated'
        || option === 'upcoming'
        || option === 'all'
        ){
            this.currentFilterStatus.filter = option;
        }
    }
    applyFilter(f){
        const list = this.data.filter(movie => {

            if(f.filter === 'topRated' && !(movie.rating.score > 8)) return false;
            if(f.filter === 'trending' && !movie.isTrending) return false;
            if(f.filter === 'upcoming' && movie.status !== 'upcoming') return false;
            
            if(f.filter === 'new') {
                const today = new Date();
                const movieDate = new Date(movie.releaseDate);

                const limitDate = (today.getFullYear() - movieDate.getFullYear()) * 12 + (today.getMonth() - movieDate.getMonth());
                if (limitDate > 3) return false;
            }

            if(f.type && movie.mediaType !== f.type) return false;
            if(f.rate && movie.rating.score < Number(f.rate)) return false;
            if(f.search && !(movie.title.toLowerCase().includes(f.search))) return false;
            if(f.year && new Date(movie.releaseDate).getFullYear() !== Number(f.year)) return false;
            if(f.genre && !movie.genres.includes(f.genre)) return false;
            if(f.age && movie.minAge !== Number(f.age)) return false;
            if(f.country && movie.countries.some(c => c.name !== f.country)) return false;

            return true;
        });
        console.log(this.currentFilterStatus);
        this.renderMovies(list);
    }
    renderMovies(list = this.data){
        this.allContainer.innerHTML = '';
        if (!list.length) {
            this.allContainer.innerHTML = `
                <div class="w-full flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <p class="text-gray-200 text-lg font-medium">No results found</p>
                    <p class="text-gray-500 text-sm">Try changing your search or filters</p>
                </div>
            `;
            return;
          };
        this.allContainer.innerHTML = `
            <div class="flex justify-center mt-10">
            <div class="w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 border-b-purple-500 animate-spin"></div>
            </div>
        `;
        let frag = document.createDocumentFragment();
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.allContainer.innerHTML = '';
            list.forEach(movie => {
                const movieBox = MovieComponent.createCard(movie , {variant: 'default'} , 'relative w-52 flex flex-col flex-shrink-0');
                frag.append(movieBox);
            });
            this.allContainer.appendChild(frag);
        },600);
    }
    init(moviesData){
        this.data = moviesData;
        this.renderMovies();
    }
}
