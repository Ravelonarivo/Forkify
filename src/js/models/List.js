import uniqid from 'uniqid';

export default class List {
    constructor() {
         this.items = [];
    }

    addItem(ingredient) {

        const item = {
            id: uniqid(),
            count: ingredient.count,
            unit: ingredient.unit,
            ingredient: ingredient.ingredient
        }

        if (this.items.length === 0) {
            this.items.push(item);
        } else {
            const element = this.items.find(item => {
                return item.unit === ingredient.unit && item.ingredient === ingredient.ingredient;
            });

            element ? element.count += ingredient.count : this.items.push(item);
        }
    }

    updateCount(id, newCount) {
        this.items.find(item => item.id === id).count = newCount;
    }

    deleteItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1);
    }
}