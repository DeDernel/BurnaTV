import { MovieComponent } from "./ui.js";


export class MoviesPage{
    constructor(){
        this.param = new window.URLSearchParams(window.location.search);

        this.type = this.param.get('type');
        this.filter = this.param.get('filter');

        this.allContainer = document.querySelector('.allMS');
        this.movies = [];
        
        this.changeTabTimer = null;


        // Recomended
        this.searchInput = document.getElementById('searchInput');
        this.RFContainer = document.querySelector('.recomendedFilters');
        this.RSConatiner = document.querySelector('.recomendedSearch');
        this.filterTabs = [
            { label: 'All',         value: 'all',      icon: 'fa-layer-group'   },
            { label: 'New',         value: 'new',      icon: 'fa-certificate'   },
            { label: 'Trending',    value: 'trends',   icon: 'fa-arrow-trend-up'},
            { label: 'Top Rated',   value: 'topRated', icon: 'fa-star'          },
            { label: 'Coming Soon', value: 'upcoming', icon: 'fa-calendar-plus' },
            { label: 'Movies',      value: 'movies', icon: 'fa-calendar-days' },
            { label: 'TV Series',   value: 'series', icon: 'fa-calendar-days' },
          ];
          this.RSConatiner.addEventListener('click' , event => {
                const li = event.target.closest('li');
                if(!li) return;
                this.searchInput.value = li.textContent.trim();
                this.recomendSearch();
          });
          this.RFContainer.addEventListener('click' , event => {
                const tab = event.target.closest('li');
                const tabValue = tab.dataset.value;
                this.filter = tabValue;

                const tabs = this.RFContainer.querySelectorAll('li');
                tabs.forEach(rm => rm.classList.remove('bg-purple-500'));

                tab.classList.toggle('bg-purple-500');
                this.RFContainer.prepend(tab);
                this.getMovieList();
          });
          this.searchInput.addEventListener('input' , () => {

            console.log(this.searchInput.value.length);
                if(this.searchInput.value.length <= 0){
                    this.RSConatiner.innerHTML = '';
                    this.RFContainer.innerHTML = '';
                    this.getMovieList();
                    this.createRecomended();
                }
                this.recomendSearch();
          });


    }
    recomendSearch(){
        let clearInput = this.searchInput.value.trim().toLowerCase();
        if(clearInput.length <= 0) return;
        const filtered = this.movies.filter(get => get.title.toLowerCase().includes(clearInput)).slice(0,8);
        this.RSConatiner.innerHTML = '';
        this.RSConatiner.innerHTML = filtered.map(get => {
            return `
                <li class="flex gap-2 border-b border-gray-500 text-sm p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>${get.title}</span>
                </li>
            `
        }).join('');
        this.allContainer.innerHTML = '';
        if(filtered.length === 0){
           
        }
        filtered.forEach(get => {
            const moviesCard = MovieComponent.createCard(get , {variant: 'default'}, 'w-52 relative flex flex-col flex-shrink-0');
            this.allContainer.append(moviesCard);
        });
    }
    createRecomended(){
        this.filterTabs.forEach(item => {
            const Tab = document.createElement('li');
            Tab.dataset.value = item.value;
            Tab.className = 'flex items-center gap-1.5 border border-gray-600 text-sm py-1 px-2 rounded-lg text-gray-200 hover:bg-purple-500 hover:border-gray-300 hover:text-white transition-colors cursor-pointer';

            const i = document.createElement('i');
            i.className = `fa-solid ${item.icon} -translate-y-px text-gray-100`;
            const span = document.createElement('span');
            span.textContent = item.label;
            Tab.append(i , span);
            this.RFContainer.append(Tab);
        });
        this.movies.filter(get => get.isTrending).map(get => get.title).slice(0,5).forEach(search => {
            const box = document.createElement('li');
            const searchRecomend = document.createElement('span');
            const i = document.createElement('i');
            i.className = 'fa-solid fa-magnifying-glass';
            searchRecomend.textContent = search;
            box.className = 'flex gap-2 border-b border-gray-500 text-sm p-2 text-gray-400 hover:text-white transition-colors cursor-pointer';
            box.append(i , searchRecomend);
            this.RSConatiner.append(box);
        });
    }
    getMovieList(){
        let toFilter = this.movies;
        if( this.type === 'series'  || this.filter === 'series'){
            toFilter = toFilter.filter(get => get.mediaType === 'series');
        }
        if(this.type === 'movies' || this.filter === 'movies'){
            toFilter = toFilter.filter(get => get.mediaType === 'movie');
        }

        


        if(this.filter === 'trends'){
            toFilter = toFilter.filter(get => get.isTrending);
        }else if(this.filter === 'topRated'){
            toFilter = toFilter.filter(get => get.rating?.score > 7.5);
        }else if(this.filter ==='upcoming'){
            toFilter = toFilter.filter(get => get.status === 'upcoming');
        }else if(this.filter === 'new'){
            toFilter = toFilter.filter(get => {
                const today = new Date();
                const contentDate = new Date(get.releaseDate);

                const latestContent = (today.getFullYear() - contentDate.getFullYear()) * 12 +
                                      (today.getMonth() - contentDate.getMonth());
                return latestContent <= 1;
            });
        }else if(this.filter === 'all'){
            toFilter = this.movies;
        }


        this.allContainer.innerHTML = '';
        toFilter.forEach(get => {
            const movieCard = MovieComponent.createCard(get , {variant: 'default'} , 'w-52 relative flex flex-col flex-shrink-0');
            this.allContainer.append(movieCard);
        });
        
        

    }
    init(moviesData){
        this.movies = moviesData;
        this.getMovieList();
        this.createRecomended();
    }
}

export class AdvanceSearchUI{
    constructor(){
        this.container = document.querySelector('.FilterDropDowns');
        this.ActiveFilterSection = document.querySelector('.ActiveFilter');
        this.advancedFilters = document.querySelector('.advancedFilters');
        
        this.data = [];
        this.dropDowns = [
            {name: 'By Year'   , value: 'Year' , icon: 'fa-regular fa-calendar text-gray-500 text-xl w-8'},
            {name: 'By Genre'  , value: '' , icon: 'fa-solid fa-masks-theater text-gray-500 text-xl w-8 '},
            {name: 'By Age'    , value: '' , icon: 'fa-solid fa-people-group text-gray-500 text-xl w-8'},
            {name: 'By Country', value: '' , icon: 'fa-solid fa-earth-europe text-gray-500 text-xl w-8 '},
        ]

        // this.ActiveFilterSection.addEventListener('click' , () => {
        //     this.ActiveFilterSection.classList.toggle('filterDropdownIsActive');
        //     this.advancedFilters.classList.toggle('hidden');
        //     this.advancedFilters.classList.toggle('filterBoxes');
        // });
    }
    initalDropDownsHTML(){
        const extract = {
            'By Year'    : [...new Set(this.data.flatMap(get => new Date(get.releaseDate).getFullYear()).sort((a , b) => b - a))],
            'By Genre'   : [...new Set(this.data.flatMap(get => get.genres).filter(C => C.length < 7))],
            'By Age'     : [...new Set(this.data.map(movie => movie.minAge).sort())],
            'By Country' : [...new Set(this.data.flatMap(movie => movie.countries).map(get => get.name).sort())]
        }
        this.dropDowns.forEach(field => {
            const box = document.createElement('div');
            box.dataset.section = field.value;
            const i = document.createElement('i');
            const btn = document.createElement('button');

            

            box.className = 'section flex items-center justify-between gap-2 border mx-2 rounded text-white pl-2 py-1 cursor-pointer';
            btn.textContent = field.name;
            i.className = field.icon;

            const list = document.createElement('ul');
            list.className = 'hidden';
            extract[field.name].forEach(opt => {
                const li = document.createElement('li');
                li.textContent = opt;
                li.className = 'option text-white p-1 px-4 hover:bg-gray-800 border-b border-gray-700 cursor-pointer';
                list.appendChild(li);
            });
            let isOpen = false;
            box.addEventListener('click' , event => {
                if(!isOpen){
                    isOpen = true;
                    list.classList.remove('closeAnim2')
                    list.classList.add('openAnim2');
                    list.classList.remove('hidden');
                }else{
                    isOpen = false;
                    setTimeout(() => {
                        list.classList.add('hidden');
                    }, 300);
                    list.classList.add('closeAnim2');
                    list.classList.remove('openAnim2');
                }
            });
            const wrapper = document.createElement('div');
            const arrowDown = document.createElement('i');
            arrowDown.className = 'fa-solid fa-angle-down mr-5';

            wrapper.append(i , btn);
            box.append(wrapper , arrowDown);
            this.container.append(box , list);
        });
        this.container.addEventListener('click' , event => {
                const currentClick = event.target.closest('li');
                if(!currentClick) return;
                console.log(currentClick.textContent);
            });
    }
    init(moviesData){
        this.data = moviesData;
        this.initalDropDownsHTML();
    }
}