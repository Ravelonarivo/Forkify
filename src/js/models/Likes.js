export default class Likes {
    constructor() {
        this.likes = [];
    }

    manage(recipe) {
        if (recipe.isLiked) {
            this.likes.push(recipe);
        } else {
            const recipeIndex = this.likes.findIndex(curr => curr === recipe);
            this.likes.splice(recipeIndex, 1);
        }
    }
}