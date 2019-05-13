import { elements, formatTitle } from './base';

export const clearInput = () => {
    elements.searchField.value = '';
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${formatTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `; 

    elements.resultsList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (type, page) => {
    const markup = `
        <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page-1 : page+1}">
            <span>Page ${type === 'prev' ? page-1 : page+1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${ type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;

    return markup;
};

const renderButtons = (page, nbResults, resPerPage) => {
    const nbrPages = Math.ceil(nbResults /  resPerPage);
    let button;
   
    if (page === 1 && nbrPages > 1) {
        button = createButton('next', page);
    } else if (page < nbrPages) {
        button = `
            ${createButton('prev', page)}
            ${createButton('next', page)}
        `;
    } else if (page === nbrPages && nbrPages > 1) {
        button = createButton('prev', page);
    }

    elements.resultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    
    const begin = (page - 1) * resPerPage;
    const end = page * resPerPage; 

    recipes.slice(begin, end).forEach(recipe => renderRecipe(recipe));

    renderButtons(page, recipes.length, resPerPage);
};

export const clearResults = () => {
    elements.resultsList.innerHTML = '';
    elements.resultsPages.innerHTML = '';
};

export const highlightResult = id => {
    for (let curr of document.querySelectorAll('.results__link')) {
        if (curr.classList.contains('results__link--active')) {
            curr.classList.remove('results__link--active');
            break;
        }
    }

    const recipeDOM = document.querySelector(`.results__link[href*="#${id}"]`);
    if (recipeDOM) {
        document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
    }
    
};

