// Global app controller
import { elements, renderLoader, clearLoader } from './views/base';

import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';

const state = {};

window.state = state;

/**
 * Search controller
 */
const controlSearch = async () => {
    // Get query from input
    const query = elements.searchField.value;

    if (query) {

        // Create new search object 
        state.search = new Search(query);

        // Clear input 
        searchView.clearInput();

        // Clear last results
        searchView.clearResults();

        // Render loader
        renderLoader('search');

        try {
            await state.search.getRecipes();

            // Clear loader
            clearLoader();

            if (state.search.recipes.length > 0) {
                // Render results
                searchView.renderResults(state.search.recipes)
            }
        } catch (error) {
            alert(error);
        }
        
    }
};

elements.search.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.resultsPages.addEventListener('click', e => {
    // Get page button 
    const button = e.target.closest('.btn-inline');
    if (button) {
        // Clear results from current page
        searchView.clearResults();

        // Get current page
        const page = parseInt(button.dataset.goto);
        
        // Render results
        searchView.renderResults(state.search.recipes, page);
    } 
})


/**
 * Recipe controler
 */
const controlRecipe = async id => {

    // Create a new recipe object 
    state.recipe = new Recipe(id);

    try {
        // Clear last recipe
        recipeView.clearRecipe();

        // Render loader
        renderLoader('recipe');

        // Get Details
        await state.recipe.getDetails();

        // Calculate time 
        state.recipe.calcTime();

        // Calculate servings
        state.recipe.calcServings();

        // Parse ingredients
        state.recipe.parseIngredients();

        // Clear loader
        clearLoader();

        // Test if recipe is liked
        state.recipe.testIfLiked(state.likes.likes)

        // Render recipe
        recipeView.renderRecipe(state.recipe);
    } catch (error) {
        alert(error);
    }
}  

elements.resultsList.addEventListener('click', e => {
    // Get recipe DOM
    const recipe = e.target.closest('.results__link');
    if (recipe) {
        // Get recipe id 
        const recipeID = recipe.href.substring(recipe.href.indexOf('#') + 1);
    
        // Highlight selected recipe 
        searchView.highlightResult(recipeID);

        controlRecipe(recipeID);
    } 
});

/**
 * Likes controler
 */
const controlLikes = () => {
  
    // Create new Likes object
    if (!state.likes) {
        state.likes = new Likes();
        
        const data = state.likes.readStorage();
        if (data && data.length > 0) {
            state.likes.likes = data;
        }
    }
        
    if (state.recipe) {
         // Like or dislike recipe 
        state.recipe.liked(); 

        // Add or remove recipe in Likes 
        state.likes.manage(state.recipe);
    }

    // Render likes 
    likesView.renderLikes(state.likes);
}; 

elements.likesList.addEventListener('click', e => {
    // Get like DOM
    const like = e.target.closest('.likes__link');
    if (like) {
        // Get like id 
        const likeID = like.href.substring(like.href.indexOf('#') + 1);
    
        // Highlight selected like 
        searchView.highlightResult(likeID);

        controlRecipe(likeID);
    } 
});

elements.recipe.addEventListener('click', e => {
    if (e.target.closest('.btn-decrease')) {
        // Decrease servings
        state.recipe.servings > 1 ? state.recipe.updateServings('dec') : '';
    } else if (e.target.closest('.btn-increase')) {
        // Increase servings
        state.recipe.updateServings('inc');
    } else if (e.target.closest('.recipe__love')) {
        controlLikes();
    }

    recipeView.clearRecipe();

    recipeView.renderRecipe(state.recipe);
});

window.addEventListener('load', () => {
    controlLikes();

    const recipeID = window.location.hash.replace('#', '');
    if (recipeID) {
        controlRecipe(recipeID);
    }
});



