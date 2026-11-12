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
            titleClass: 'text-gray-100 text-4xl md:text-6xl font-bebas',
            releaseDate: 'text-sm text-gray-100',
        },

    }
    static createCard(movie , options = {} , extraClass){
        const variantName = options.variant || 'default';
        const config = {...this.variants[variantName]}
        
        const scoAge = document.createElement('div');
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
            const desc = document.createElement('span');

            scoAge.innerHTML = 
            `
                <div class="text-sm bg-white/10 p-1 px-2 rounded-xl">
                    <span>${movie.releaseDate}</span>
                </div>
                <div class="flex gap-1">
                    <i class="fa-solid fa-user-shield text-blue-300"></i>
                    <span class="text-gray-100">${movie.minAge}</span> 
                </div>
                
                <div class="flex gap-1">
                    <i class="fa-solid fa-star text-yellow-500"></i>
                    <span class="text-gray-100">${movie.rating.score}</span>
                </div>
                
                
            `
            scoAge.className = 'flex items-center gap-3 font-bold font-bebas';
            const rowPanel = document.createElement('div');
            rowPanel.className = 'flex flex-col gap-2 flex-wrap py-2'


            desc.textContent = movie.summary;
            desc.className = 'line-clamp-4 max-w-full text-sm pb-5';
            card.className = 'text-gray-100 flex flex-col gap-3 ml-5';

            const box = document.createElement('div');
            box.className = 'flex items-center flex-wrap gap-2 border-t border-white/20 pt-2';

            movie.genres.forEach(element => {
                const span = document.createElement('span');
                span.textContent = element;
                span.className = 'text-xs text-gray-200 bg-white/10 px-3 py-1 rounded-full';
                box.appendChild(span);
            });

            if (movie.genres.length && movie.countries.length) {
                const separator = document.createElement('span');
                separator.className = 'text-white mx-1';
                separator.textContent = '•';
                box.appendChild(separator);
            }

            movie.countries.forEach(element => {
                const wrapper = document.createElement('div');
                wrapper.className = 'flex items-center gap-1.5 text-xs text-gray-300';

                const img = document.createElement('img');
                img.src = element.flag;
                img.className = 'w-4 h-3 object-cover rounded-sm';

                const span = document.createElement('span');
                span.textContent = element.name;

                wrapper.append(img, span);
                box.appendChild(wrapper);
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
