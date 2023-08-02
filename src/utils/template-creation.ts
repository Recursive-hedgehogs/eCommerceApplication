export function createTemplate<Type>(htmlFromString: string): Type {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = htmlFromString;
    return template.content.firstChild as Type;
}
