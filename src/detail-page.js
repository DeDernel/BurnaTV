import { MovieComponent } from './components/movie-card.js'

export class Detail {
    constructor(){
        this.refrenceID = new window.URLSearchParams(window.location.search).get('id');
        this.container = document.querySelector('.hero-box');
        this.currentMovie = null;
        
        this.elements = {
            panel: document.querySelector('.info-panel'),
            backdrop: document.querySelector('.movie-backdrop'),
        }
    }
    init(data){
        this.currentMovie = data.find(get => get.id === Number(this.refrenceID));
        if(!data || data.length === 0){
            this.renderNotFound();
            return;
        }
        if(!this.currentMovie){
            this.renderNotFound();
            return;
        }

        this.render();
    }
    renderNotFound(){
        this.container.innerHTML = `
            <div class="text-5xl w-fit mx-auto mt-24 text-white flex flex-col items-center gap-2 relative">
                <img src="images/notFoundImg.png" alt="nothing-found" class="w-96">
                <span class="text-xl absolute bottom-20 text-gray-500">No Result Found</span>
                <p class="text-sm text-white/30">Movie you looking for not found use button below to <span class="text-white">Explore</span></p>
                <a href="index.html" class="border flex items-center gap-4 bg-violet-500 text-sm rounded-xl px-3 py-2 hover:bg-violet-600/90 transition duration-300">Browse Movies <i class="fa-solid fa-arrow-right-long"></i></a>
            </div>s
        `;
    };
    render(){
        this.elements.backdrop.src = this.currentMovie.backdrop_url;




        const movie = MovieComponent.createCard(this.currentMovie , {variant: 'detail'} , );
        this.elements.panel.appendChild(movie);
    }
}
