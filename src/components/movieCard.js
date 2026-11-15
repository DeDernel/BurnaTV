

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
        box.className = 'relative flex cursor-pointer w-52 gap-2 flex-shrink-0 group';
  
        const bookmark = this.createBookMark();
        const img = this.createImage(movie);
        const focusWrapper = this.createFocusWrapper();
        
        focusWrapper.appendChild(img);
        box.append(focusWrapper , bookmark);

        return box;
    }


    static createSlider(movie){
        const box = document.createElement('div');
        box.className = 'text-gray-100 flex flex-col gap-2 ml-5 mb-10';

        const year = this.createYear(movie);
        const score = this.createScore(movie);
        const title = this.createTitle(movie);
        
        title.className = 'font-druk text-4xl lg:text-7xl';

        const yearScoreSeason = document.createElement('div');
        yearScoreSeason.className = 'text-sm flex gap-3';

        const type = document.createElement('span');
        type.textContent = movie.mediaType === 'series' ? `Season ${5}` : '3 Hour';

        score.innerHTML = `<i class="fa-regular fa-star"></i> ${movie.rating?.score}`;
        score.className = 'text-yellow-500';

        year.className = '';

        const rowPanel = document.createElement('div');
        rowPanel.className = 'flex flex-col gap-2 flex-wrap py-2';


        const desc = document.createElement('p');
        desc.textContent = movie.summary;
        desc.className = 'line-clamp-4 w-96 text-gray-400 max-w-full text-xs md:text-xl py-2';

        const genre = document.createElement('div');
        genre.textContent = movie.genres[0];



        const refrenceBtns = document.createElement('div');
        const viewMore = document.createElement('button');
        const watchList = document.createElement('button');

        refrenceBtns.className = 'flex gap-2';
        viewMore.innerHTML = `<a href="Detail.html?id=${movie.id}" class="flex items-center justify-center gap-2"><i class="fa-solid fa-circle-info text-sm"></i> More Info</a>`;
        viewMore.className = 'border h-12 w-48 rounded-full bg-violet-800 text-white border-white/30 hover:bg-inherit hover:border-white/30 hover:text-white transition';

        watchList.innerHTML = `<a class="flex items-center justify-center gap-2"><i class="fa-solid fa-plus text-xl"></i></a>`;
        watchList.className = 'border w-12 h-12 rounded-full bg-black/40 text-white border-white/10';

        yearScoreSeason.append(score ,year , genre , type);
        refrenceBtns.append(viewMore , watchList);

        box.append(title , desc , yearScoreSeason , rowPanel , refrenceBtns);

        return box;
    }



    static createTitle(movie){
        const title = document.createElement('h1');
        title.textContent = movie.title;

        return title;
    }
    static createImage(movie){
        const image = document.createElement('img');
        image.className = 'focusImage';
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
            <button class="w-12 h-12  flex items-center absolute top-2 left-2 hidden group-hover:flex justify-center bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-violet-600/50 transition-all duration-300">
                <i class="fa-regular fa-bookmark text-xl"></i>
            </button>
        `;
        return bookmark;
    }
}
