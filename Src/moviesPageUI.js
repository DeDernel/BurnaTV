export class MoviesPage{
    constructor(){
        this.moviesContainer = document.querySelector('.movies');
        this.movies = [];
    }
    init(moviesData){
        this.movies = moviesData.filter(get => get.type === 'Movie');
        this.featContent();
    }
    moviesHTML(){
        return this.movies.map(get => {
            return `
                <a href="movieDetail.html?id=${get.id}" class="">
                        <img src="${get.poster_url}" class="h-80 w-64 object-cover">
                </a>
            `
        }).join('');
    }
    featContent(){
        if(!this.moviesContainer) return;
        this.moviesContainer.innerHTML = this.moviesHTML();
        this.movies = [];
    }
}


export class FilterDropper{
    constructor(key , selectedContainer){
        this.key = key;
        this.keyContainer = document.querySelector(selectedContainer);
        this.filterPanel = document.querySelector('.filterPanel');
        this.dropTime = null;

        this.filterPanel.addEventListener('click' , (event) => {
            const allTargets = this.filterPanel.querySelectorAll('span');
            allTargets.forEach(rm => rm.classList.remove('text-purple-500'));

            const currentTarget = event.target.closest('li');

            const textColor = currentTarget.querySelector('span');
            const currentList = currentTarget.querySelector('div');
            textColor.classList.add('text-purple-500');

            const allTabs = this.filterPanel.querySelectorAll('div');


            allTabs.forEach(rm => rm.classList.add('hidden'));
            currentList.classList.remove('hidden');
            clearTimeout(this.dropTime);
            this.dropTime = setTimeout(() => {
            currentList.classList.add('opacity-100');
            },100);
            


            
            

        });
    }
    nestedFix(path , obj){
        return path.split('.').reduce((acc,crr) => acc?.[crr] ,obj);
    }
    init(data){
        this.movies = data;
        const uniqueValues = [...new Set(this.movies.flatMap(get => this.nestedFix(this.key , get)))];
        console.log(uniqueValues);

        uniqueValues.forEach(value => {
            this.keyContainer.innerHTML += this.dropHTML(value);
        });
    }
    dropHTML(tab){
        return `
            <span class="text-sm py-1 hover:text-purple-400 cursor-pointer">${tab}</span>
        `
    }
}