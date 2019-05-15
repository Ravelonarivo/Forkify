// Global app controller
import { elements, renderLoader, clearLoader } from './views/base';

import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import * as listView from './views/listView';

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
const controlRecipe = async () => {

    // Get recipe id
    const id = window.location.hash.replace('#', '');
    
    if (id) {
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

            // Highlight selected recipe 
            searchView.highlightResult(id);

            // Render recipe
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert(error);
        }
    }
}  

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * Likes controler
 */
const controlLikes = buttonClicked => {
  
    // Create new Likes object
    if (!state.likes) {
        state.likes = new Likes();
        
        // Get data from localStorage
        const data = state.likes.readStorage();
        
        if (data && data.length > 0) {
            state.likes.likes = data;
        }
    }
        
    if (state.recipe && buttonClicked) {
         // Like or dislike recipe 
        state.recipe.liked(); 

        // Add or remove recipe in Likes 
        state.likes.manage(state.recipe);

        // Toggle like button
        recipeView.toggleLike(state.recipe);
    } 

    // Render likes 
    likesView.renderLikes(state.likes);
}; 

window.addEventListener('load', () => {
    controlLikes(false);
});


/**
 * List controler  
 */
const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }

    // Add ingredients into list 
    state.recipe.ingredients.forEach(ingredient => {
        state.list.addItem(ingredient);
    });

    // Clear previous list 
    listView.clearList();

    // Render List 
    state.list.items.forEach(item => {
       listView.renderList(item);
    });
}

elements.shoppingList.addEventListener('change', e => {
    const itemId  = e.target.closest('.shopping__item').dataset.itemid;
    const itemCount = parseFloat(e.target.closest('.shopping__count input').value, 10);
    
    // Updata list item count
    state.list.updateCount(itemId, itemCount);
});

elements.shoppingList.addEventListener('click', e => {
    const itemId  = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.closest('.shopping__delete')) {
        // Delete item from list view
        listView.deleteItem(itemId);

        // Delete item from list object
        state.list.deleteItem(itemId);
    }  
});


// Manage button click on recipe view
elements.recipe.addEventListener('click', e => {
    if (e.target.closest('.btn-decrease')) {
        // Decrease servings
        state.recipe.servings > 1 ? state.recipe.updateServings('dec') : '';
        recipeView.updateRecipeIngredients(state.recipe);
    } else if (e.target.closest('.btn-increase')) {
        // Increase servings
        state.recipe.updateServings('inc');
        recipeView.updateRecipeIngredients(state.recipe);
    } else if (e.target.closest('.recipe__love')) {
        controlLikes(true);
    } else if (e.target.closest('.recipe__btn--add')) {
        controlList();
    }
});



