import { CategoryComponent } from './category';

export class CategoryController {
    private categoryComponent: CategoryComponent;

    constructor(categoryComponent: CategoryComponent) {
        this.categoryComponent = categoryComponent;
        this.addListeners();
    }

    private addListeners() {
        this.categoryComponent.categoryButton.addEventListener('click', () =>
            console.log(this.categoryComponent.category)
        );
    }
}
