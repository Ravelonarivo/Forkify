import { elements, formatTitle } from './base';

const createLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.imageUrl}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${formatTitle(like.title)}.</h4>
                    <p class="likes__author">${like.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

const toggleLike = nbLike => {
    elements.likesField.style.visibility = nbLike > 0 ? 'visible' : 'hidden';
}

const clearLikes = () => {
    elements.likesList.innerHTML = '';
};

export const renderLikes = likes => {
    toggleLike(likes.likes.length); 

    clearLikes();
    
    likes.likes.forEach(like => createLike(like));
}

