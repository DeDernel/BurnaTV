import { movies } from "./services/data.js";
import { MoviesPage , FilterOperation} from "./moviesPageUI.js";
import * as UI from './ui.js';

const page = document.body.dataset.page;


function initMainPage(){
    new UI.Sliders().init(movies);
    new UI.MovieRow('.weeklyTrends' , 'week').init(movies);
    new UI.MovieRow('.newReleased' , 'new').init(movies);
    new UI.Casts().init(movies);
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
pages[page]();

