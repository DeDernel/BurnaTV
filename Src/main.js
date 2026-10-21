import { movies } from "./data.js";
import { MoviesPage , FilterDropper} from "./moviesPageUI.js";
import 
{ 
    Sliders , 
    AdvancedSearch , 
    PopularSection , 
    category , 
    Casts , 
} 
from "./ui.js";

function init(){
    if(document.body.classList.contains('mainPage')){
        let manageSliders = new Sliders().init(movies);
        let simpleSearch = new AdvancedSearch().init(movies);
        let populars = new PopularSection().getPopularData(movies);
        let categories = new category().createCategorySection(movies);
        let OperateCasts = new Casts().init(movies);
    }
    if(document.body.classList.contains('moviesPage')){
        let moviePage = new MoviesPage().init(movies);
        let yearFilter = new FilterDropper('year' , '.years-filter').init(movies);
        let genreFilter = new FilterDropper('genres' , '.genres-filter').init(movies);
        let ratingFilter = new FilterDropper('rating.score' , '.rating-filter').init(movies);
        let familyFilter = new FilterDropper('minAge' , '.family-filter').init(movies);
    }
    
}
init();
