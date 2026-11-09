
import { MoviesPage , FilterOperation} from "./moviesPageUI.js";
import * as UI from './ui.js';

const page = document.body.dataset.page;

let movies = [];

async function loadMovies(){
    try{
        const response = await fetch('./src/services/data.json');
        if(!response.ok) throw Error('HTTP' + response.status);
        const data = await response.json();

        return data;
    }
    catch(err){
        console.log(err);
    }
}
async function initApp() {
    movies = await loadMovies();

    if (!movies.length) return;

    pages[page]?.(movies);
}

initApp();

function initMainPage(){
    new UI.Sliders().init(movies);
    new UI.MovieRow('.weeklyTrends' , 'week').init(movies);
    new UI.MovieRow('.newReleased' , 'new').init(movies);
    // new UI.Casts().init(movies);
}
function initBrowsePage(){
    let filterLogic = new FilterOperation();
    filterLogic.init(movies);
    new MoviesPage(filterLogic).init(movies);
}
let pages = {
    main: initMainPage,
    browse: initBrowsePage
}

