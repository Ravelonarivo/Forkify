export const elements = {
    search: document.querySelector('.search'),
    searchField: document.querySelector('.search__field'),

    resultsList: document.querySelector('.results__list'),
    resultsPages: document.querySelector('.results__pages'), 
    
    recipe: document.querySelector('.recipe'),

    likesField: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const renderLoader = (part) => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    if (part === 'search') {
        elements.resultsList.insertAdjacentHTML('afterbegin', loader);
    } else if (part === 'recipe') {
        elements.recipe.insertAdjacentHTML('afterbegin', loader);
    }
};

export const clearLoader = () => {
    document.querySelector('.loader').parentNode.removeChild(document.querySelector('.loader'));
};

export const formatTitle = title => {
    return title.length > 16 ? `${title.substring(0, 17)} ...`  : title;
};