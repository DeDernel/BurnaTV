import { MovieComponent } from "./movieCard.js";

export class MovieRow{
    constructor(container , key){
        this.Section = document.querySelector(container);
        this.filterType = key;

        this.config = {
            trends: {
                value: 'trends',
                name: 'Trending Now',
                sub: 'The hottest movies now'
            },
            upcoming: {
                value: 'upcoming',
                name: 'Coming Soon',
                sub: 'The hottest movies now'
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
        div.className = 'py-4';
        const headerBox = document.createElement('div');
        headerBox.className = 'flex justify-between items-center';
        const header = document.createElement('div');
        header.className = 'text-white flex gap-2';

        const h3 = document.createElement('h3');
        const line = document.createElement('span');

        h3.textContent = this.config[this.filterType].name;
        line.textContent = '/';
        line.className = 'text-violet-600 text-xl font-bold';

        const button = document.createElement('button');
        button.textContent = 'Explore All';
        button.className = 'text-violet-600';

        const span = document.createElement('span');
        span.textContent = this.config[this.filterType].sub;
        span.className = 'text-gray-500 text-sm';

        header.append(line , h3);
        headerBox.append(header , button);
        div.append(headerBox , span);





        

        const list = document.createElement('article');
        list.className = 'flex overflow-x-auto';

        const frag = document.createDocumentFragment();
        filtered.forEach(movie => {
            const movieBox = MovieComponent.createCard(movie , {variant: 'Section'});
            frag.appendChild(movieBox);
        });


        list.appendChild(frag);
        this.Section.append(div , list);
    }
}