import { movies } from "./data.js";
import { MoviesPage , FilterOperation} from "./moviesPageUI.js";
import 
{ 
    Sliders , 
    MovieRow , 
    Casts , 
} 
from "./ui.js";

function init(){
    if(document.body.classList.contains('mainPage')){
        let manageSliders = new Sliders().init(movies);
        const weekly = new MovieRow('.weeklyTrends' , 'week').init(movies);
        const released = new MovieRow('.newReleased' , 'new').init(movies);
        let OperateCasts = new Casts().init(movies);
    }
    if(document.body.classList.contains('moviesPage')){
        let filterLogic = new FilterOperation();
        filterLogic.init(movies);
        let moviePage = new MoviesPage(filterLogic).init(movies);
    }

}
init();
