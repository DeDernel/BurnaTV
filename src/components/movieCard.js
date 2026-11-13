export class MovieComponent{
    static variants = {
        movieList : {
            tag: 'a',
            showInfo: true,
            titleClass: 'text-gray-100 line-clamp-1 text-sm',
            releaseDate: 'text-xs text-gray-500',
            image: 'object-cover rounded-lg mb-2 focusImage'
        },
        sliderPanel: {
            infoPanel: true,
            tag: 'div',
            titleClass: 'text-gray-100 text-4xl md:text-6xl font-bebas',
            releaseDate: 'text-sm text-gray-100',
        },
        default: {
            tag: 'a',
            onlyimage: true,
            image: 'rounded-xl focusImage object-cover'
        }

    }
    static createCard(movie , options = {} , extraClass){
        const variantName = options.variant || 'default';
        const config = {...this.variants[variantName]}
        
        const scoAge = document.createElement('div');
        


        // common
        const title = document.createElement('p');
        const year = document.createElement('span');
        const img = document.createElement('img');
        const movieRefrenceBtns = document.createElement('div');
        const focusWrapper = document.createElement('div');
        




        title.textContent = movie.title;
        title.className = config.titleClass;

        year.textContent = `(${movie.releaseDate})`;
        year.className = config.releaseDate;

        img.src = movie.poster_url ?? '';
        img.className = `${config.image}`;
        img.loading = 'lazy';

        movieRefrenceBtns.className = 'bg-red-500 flex flex-col gap-2 text-xl';
        movieRefrenceBtns.innerHTML = `
            <button class="w-8 h-8 flex items-center absolute top-5 left-5 hidden group-hover:flex justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-violet-600 transition-all duration-300">
                <i class="fa-regular fa-bookmark"></i>
            </button>
        `;

        focusWrapper.className = 'overflow-hidden rounded-xl';
        focusWrapper.appendChild(img);


        const card = document.createElement(config.tag);

        if(config.tag === 'a'){
            card.href = `movieDetail.html?id=${movie.id}`;
        }
        card.className = `p-2 rounded ${extraClass}`;

        
        
        


        if(config.showInfo){
            const score = document.createElement('div');
            const info = document.createElement('div');

            score.className = 'my-2';
            score.innerHTML = `
                <span class="p-1 text-sm bg-yellow-500 font-Orbitron rounded">IMDB</span>               
                <span class="text-xl text-yellow-500">${movie.rating.score ?? ''}<span class="text-sm text-gray-500"> / 10</span></span>
                `;

            

            
            info.append(title , year);
            card.append(focusWrapper , info , score , movieRefrenceBtns);
        }

        if(config.onlyimage){ 
            card.append(focusWrapper , movieRefrenceBtns);
        }

        



        if(config.infoPanel){
            const desc = document.createElement('span');
            scoAge.innerHTML = 
            `
                <div class="text-xs bg-white/10 p-1 px-2 rounded-xl">
                    <span>${movie.releaseDate}</span>
                </div>
                <div class="flex text-xs gap-1">
                    <i class="fa-solid fa-star text-yellow-500"></i>
                    <span class="text-gray-100">${movie.rating.score}</span>
                </div>
            `
            scoAge.className = 'flex items-center gap-3 font-bold font-bebas';
            const rowPanel = document.createElement('div');
            rowPanel.className = 'flex flex-col gap-2 flex-wrap py-2';


            desc.textContent = movie.summary;
            desc.className = 'line-clamp-4 text-gray-400 max-w-full text-xs md:text-sm';
            card.className = 'text-gray-100 flex flex-col gap-3 ml-5';

            const box = document.createElement('div');
            box.className = 'flex items-center flex-wrap gap-2 border-t border-white/20 py-2';

            movie.genres.forEach(element => {
                const span = document.createElement('span');
                span.textContent = element;
                span.className = 'text-xs text-gray-200 bg-white/10 px-3 py-1 rounded-full';
                box.appendChild(span);
            });  

            const refrenceBtns = document.createElement('div');
            const wishlistBtn = document.createElement('button');
            const viewDetailBtn = document.createElement('button');
            refrenceBtns.className = 'hidden md:flex gap-2';
            wishlistBtn.innerHTML = '<a href="" class="flex items-center justify-center gap-2"><i class="fa-solid fa-circle-info text-sm"></i> More Info</a>';
            wishlistBtn.className = 'border py-3 px-6 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 hover:text-white transition duration-300';
            viewDetailBtn.innerHTML = '<span class="flex items-center justify-center gap-2"><i class="fa-solid fa-play text-sm"></i> Watch now </span>';
            viewDetailBtn.className = 'border py-3 px-6 rounded-full bg-violet-800 border-white hover:bg-inherit transition duration-300';


            refrenceBtns.append(viewDetailBtn , wishlistBtn);
            rowPanel.append(box);
            card.append(scoAge , title , desc , rowPanel , refrenceBtns);
        }
        return card;
    }
}
