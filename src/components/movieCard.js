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
            img.loading = 'lazy';

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
