// Global app controller
import { elements, renderLoader, clearLoader } from './views/base';

import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

const state = {};

window.state = state;

/**
 * Search controller
 */
const controlSearch = async () => {
    // Get query from input
    const query = elements.searchField.value;

    if (query) {
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


/**
 * Recipe controler
 */
const controlRecipe = async id => {

    // Create a new recipe
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

        // Render recipe
        recipeView.renderRecipe(state.recipe);
    } catch (error) {
        alert(error);
    }
}  


elements.search.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.resultsPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        searchView.clearResults();
        const page = parseInt(button.dataset.goto);
        searchView.renderResults(state.search.recipes, page);
    } 
})

elements.resultsList.addEventListener('click', e => {
    const recipe = e.target.closest('.results__link');
    
    if (recipe) {
        searchView.highlightResult(recipe);

        const recipeID = recipe.href.substring(recipe.href.indexOf('#') + 1);
    
        controlRecipe(recipeID);
    } 
});

elements.recipe.addEventListener('click', e => {
    if (e.target.closest('.btn-decrease')) {
        state.recipe.servings > 1 ? state.recipe.updateServings('dec') : '';
    } else if (e.target.closest('.btn-increase')) {
        state.recipe.updateServings('inc');
    }

    recipeView.renderRecipe(state.recipe);
});



