// Global app controller
import { elements } from './views/base';

import Search from './models/Search';

import * as searchView from './views/searchView';

const state = {};

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
        searchView.renderLoader();

        try {
            await state.search.getRecipes();

            // Clear loader
            searchView.clearLoader();

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
    }
});