export class Router {
    
    constructor() {
        window.addEventListener('popstate', (e) => {
            console.log(e);
            document.querySelector('main')!.innerHTML = e.state.page;

        });
        history.pushState({ page: 1 }, 'title 1', '?page=1');
        history.pushState({ page: 2 }, 'title 2', '?page=2');
        history.pushState({ page: 'main' }, 'title main', 'main');
    }

    navigate() {
        history.go(1);
        history.back();

    }
    
}