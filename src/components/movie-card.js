

export class MovieComponent{
    static createCard(movie , options = {}){
        const variantName = options.variant || 'Default';
        
        switch(variantName){
            case 'Slider': return this.createSlider(movie);
            case 'Section': return this.createDefault(movie);
            case 'Detail': return this.createDetail(movie);
            case 'List': return this.createMoviePage(movie);
        }
    }

    static createDetail(movie){
        const box = document.createElement('div');
        const year = this.createYear(movie);
        const title = this.createTitle(movie);

        const sort = document.createElement('span');
        sort.textContent = `#${movie.id}`;
        sort.className = 'text-white/40 text-3xl';
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center gap-4';
        wrapper.append(sort , year);

        box.append(wrapper , title);

        return box;
    }

    static createMoviePage(movie){
        const box = document.createElement('div');
        box.className = 'relative cursor-pointer w-52 gap-2 flex-shrink-0 p-2 rounded-xl group bg-white/10';
        

        const title = this.createTitle(movie);
        const year = this.createYear(movie);
        const score = this.createScore(movie);
        const img = this.createImage(movie);
        const focusWrapper = this.createFocusWrapper();
        const bookmark = this.createBookMark();

        title.className = 'text-gray-100 line-clamp-1 text-sm';
        year.className = 'text-xs text-gray-500';
        img.className = 'object-cover rounded-lg mb-2 focusImage';


        


        score.className = 'my-2';
        score.innerHTML = `
            <span class="p-1 text-sm bg-yellow-500 font-Orbitron rounded">IMDB</span>               
            <span class="text-xl text-yellow-500">${movie.rating.score ?? ''}<span class="text-sm text-gray-500"> / 10</span></span>
            `;

            
        const div = document.createElement('div');
        div.className = 'px-2 py-1';
        div.append(year , title , score , bookmark);
        focusWrapper.appendChild(img);
        box.append(focusWrapper , div);

        return box;
    }




    static createDefault(movie){
        const box = document.createElement('div');
        box.className = 'relative flex cursor-pointer w-44 flex-shrink-0 group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-purple-500/20';
  

        const bookmark = this.createBookMark();
        const score = this.createScore(movie);

        const between = document.createElement('div');
        between.className = 'absolute top-3 flex items-center text-sm justify-between px-2 w-full';
        


        

        const img = this.createImage(movie);
        const focusWrapper = this.createFocusWrapper();

        

        between.append(bookmark , score);
        focusWrapper.appendChild(img);
        box.append(focusWrapper , between);

        return box;
    }


    static createSlider(movie){
        const box = document.createElement('div');
        box.className = 'text-gray-100 flex flex-col ';

        const year = this.createYear(movie);
        const score = this.createScore(movie);
        
        
        

        const yearScoreSeason = document.createElement('div');
        yearScoreSeason.className = 'text-sm md:text-base flex gap-3 p-2';
        score.innerHTML = `<i class="fa-regular fa-star"></i> ${movie.rating?.score}`;
        score.className = 'text-yellow-500';
        year.innerHTML = `<i class="fa-solid fa-calendar-days text-gray-400"></i> ${movie.releaseDate}`
        year.className = '';


        

        const rowPanel = document.createElement('div');
        rowPanel.className = `absolute w-64
        inset-x-0
        bottom-16
        z-10
        flex flex-col
        gap-2
        px-3`

        const title = this.createTitle(movie);
        const desc = document.createElement('p');
        desc.textContent = movie.summary;
        desc.className = 'line-clamp-4 text-gray-300 max-w-full text-xs w-96';
        title.className = 'font-druk text-base w-44 lg:text-7xl';


        const refrenceBtns = document.createElement('div');
        const watchNow = document.createElement('button');

        refrenceBtns.className = 'flex items-center gap-4 px-3';
        watchNow.innerHTML = `
        <button class="inline-flex items-center justify-center gap-2
            px-3 py-1
            rounded-xl
            bg-gradient-to-r from-purple-600 to-violet-700
            border border-purple-400/30
            text-white font-semibold text-xs">
            
                <i class="fa-solid fa-circle-play text-lg"></i>
                Watch Now
        
        </button>`;

        const bookmark = this.createBookMark();
        bookmark.className = 'text-xl leading-none';

        refrenceBtns.append(bookmark , watchNow);
        rowPanel.append(title , desc , refrenceBtns);
        yearScoreSeason.append(score , year);
        box.append(yearScoreSeason  , rowPanel);

        return box;
    }



    static createTitle(movie){
        const title = document.createElement('h1');
        title.textContent = movie.title;

        return title;
    }
    static createImage(movie){
        const image = document.createElement('img');
        image.className = 'h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105';
        image.src = movie.poster_url;

        return image;
    }
    static createYear(movie){
        const year = document.createElement('span');
        year.textContent = new Date(movie.releaseDate).getFullYear();

        return year;
    }
    static createScore(movie){
        const score = document.createElement('span');
        score.textContent = movie.rating?.score;

        return score;
    }
    static createFocusWrapper(){
        const wrapper = document.createElement('div');
        wrapper.className = 'overflow-hidden rounded-xl';

        return wrapper;
    }
    static createBookMark(){
        const bookmark = document.createElement('div');
        bookmark.innerHTML = `
            <button class="text-white">
                <i class="fa-regular fa-bookmark"></i>
            </button>
        `;
        return bookmark;
    }
    static createScore(movie) {
        const btn = document.createElement('button');
        const span = document.createElement('span');
        const i = document.createElement('i');
    
        btn.className = 'inline-flex items-center justify-center gap-1 bg-black/50 py-1 px-3 rounded-xl';
    
        span.className = 'text-yellow-400 text-xs font-semibold leading-none';
        span.textContent = movie.rating?.score;
    
        i.className = 'fa-solid fa-star text-yellow-500 text-xs leading-none shrink-0';
    
        btn.append(i, span);
    
        return btn;
    }
}
