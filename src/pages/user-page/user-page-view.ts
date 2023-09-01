import { ICreateCustomerCredentials } from '../../constants/interfaces/credentials.interface';
import ElementCreator from '../../utils/template-creation';

class UserPageView {
    userData: ICreateCustomerCredentials | null;
    constructor() {
        this.userData = null;
    }

    public build(): HTMLElement {
        const container = new ElementCreator({ tag: 'div', classNames: ['container'] }).getElement();
        const content = new ElementCreator({ tag: 'div', classNames: ['modal-content'] }).getElement();
        const header = new ElementCreator({ tag: 'div', classNames: ['modal-header, header-bg-color'] }).getElement();
        const headerTitle = new ElementCreator({
            tag: 'h5',
            classNames: ['modal-title'],
            textContent: 'User Profile',
        }).getElement();
        header.append(headerTitle);
        content.append(header);
        container.append(content);
        return container;
    }
}

export default UserPageView;
