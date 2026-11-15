
import { MoviesPage , FilterOperation} from "./moviesPageUI.js";
import * as UI from './ui.js';
import { Detail } from "./detail.js";
import { MovieRow } from "./components/movieRow.js";

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

    new MovieRow('.trending-now' , 'trends').init(movies);
    new MovieRow('.upcoming' , 'upcoming').init(movies);

}
function initBrowsePage(){
    let filterLogic = new FilterOperation();
    filterLogic.init(movies);
    new MoviesPage(filterLogic).init(movies);
}
function initDetailPage(){
    new Detail().init(movies);
}
let pages = {
    main: initMainPage,
    browse: initBrowsePage,
    detail: initDetailPage
}

