import { MovieComponent } from "./movie-card.js";
import { Scroller } from "../ui.js";

export class MovieRow{
    constructor(container , key){
        this.Section = document.querySelector(container);
        this.filterType = key;

        this.config = {
            trends: {
                value: 'trends',
                name: 'Trending Now',
                sub: 'The hottest movies right now'
            },
            upcoming: {
                value: 'upcoming',
                name: 'Coming Soon',
                sub: 'Make your calendars!'
            }
        }
        
    }
    init(data){
        if(!data || data.length === 0) return;
        this.movies = data;
        this.setSectionType();
    }

    setSectionType(){
        let filtered;

        const filter = {
            trends:  this.movies.filter(movie => movie.isTrending),
            upcoming:  this.movies.filter(movie => movie.status === 'upcoming')
        }

        filtered = filter[this.filterType];

        this.renderHTML(filtered);
    };

    renderHTML(filtered){
        const div = document.createElement('div');
        div.className = '';
        const headerBox = document.createElement('div');
        headerBox.className = 'flex justify-between items-center';
        const header = document.createElement('div');
        header.className = 'text-white flex gap-2 items-center';

        const h3 = document.createElement('h3');
        const line = document.createElement('span');

        h3.textContent = this.config[this.filterType].name;
        h3.className = 'text-bold';
        line.textContent = '/';
        line.className = 'text-violet-600 text-4xl font-extrabold';

        const button = document.createElement('button');
        button.innerHTML = '<div class="flex items-center text-xs pr-4"><span>Explore All</span> <i class="fa-solid fa-arrow-right-long ml-2"></i></div>';
        button.className = 'text-violet-600';

        const span = document.createElement('span');
        span.textContent = this.config[this.filterType].sub;
        span.className = 'text-gray-500 text-sm';

        header.append(line , h3);
        headerBox.append(header , button);
        div.append(headerBox , span);



  

        
        // bookmark All
        const list = document.createElement('article');
        list.className = 'obs flex overflow-x-auto no-scrollbar gap-3 py-2';

        const wrapper = document.createElement('div');
        wrapper.className = 'hidden';

        wrapper.innerHTML = `
            <button class="back absolute z-20 flex items-center justify-center w-10 h-10 rounded-full top-1/2 text-sm left-3 text-white"><i class="fa-solid fa-caret-left text-violet-600 text-3xl"></i></button>
            <button class="forward absolute z-20 flex items-center justify-center w-10 h-10 rounded-full top-1/2 text-sm right-3 text-white "><i class="fa-solid fa-caret-right text-violet-600 text-3xl"></i></button>
        `;

        const contentBox = document.createElement('div');
        contentBox.className = 'relative';

        const frag = document.createDocumentFragment();
        filtered.forEach(movie => {
            const movieBox = MovieComponent.createCard(movie , {variant: 'Section'});
            frag.appendChild(movieBox);
        });
        
        contentBox.append(list , wrapper);
        list.appendChild(frag);
        this.Section.append(div , contentBox);
        this.setScroll(list , contentBox);



        const resizer = new ResizeObserver(entries => {
            for (const entry of entries){
                this.updateNavigatorBtns(entry.target, wrapper);
            }
        });

        const lists = document.querySelectorAll('.obs');
        lists.forEach(ch => resizer.observe(ch));
        
    }
    updateNavigatorBtns(target, wrapper) {
        wrapper.className = target.scrollWidth > target.clientWidth ? 'flex' : 'hidden';
    }

    setScroll(container , navigator){
        const scroll = new Scroller(container);
        navigator.addEventListener('click' , event => {
            if(event.target.closest('.forward')){
                scroll.nextMovie();
            }else if(event.target.closest('.back')){
                scroll.prevMovie();
            }
        })
    }


}