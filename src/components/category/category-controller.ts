import { CategoryComponent } from './category';
import App from '../../app/app';

export class CategoryController {
    private categoryComponent: CategoryComponent;
    private app: App;

    constructor(categoryComponent: CategoryComponent) {
        this.categoryComponent = categoryComponent;
        this.app = new App();
        this.addListeners();
    }

    private addListeners(): void {
        this.categoryComponent.categoryButton.addEventListener('click', this.onCategoryClick);
    }

    onCategoryClick = (): void => {
        const filter: string[] = [`categories.id:"${this.categoryComponent.category.id}"`];
        this.app.catalogPage.updateContent({ filter });
    };
}
