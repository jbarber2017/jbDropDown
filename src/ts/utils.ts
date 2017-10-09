export class Utils {

    static exists(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        } else {
            return true;
        }
    }

    static missing(value: any): boolean {
        return !this.exists(value);
    }

    static iterateObject(object: any, callback: (key: string, value: any) => void) {
        if (this.missing(object)) {
            return;
        }
        let keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = object[key];
            callback(key, value);
        }
    }

    static mapObject<TResult>(object: any, callback: (item: any) => TResult) {
        let result: TResult[] = [];
        Utils.iterateObject(object, (key: string, value: any) => {
            result.push(callback(value));
        });
        return result;
    }

    static forEachSnapshotFirst(list: any[], callback: (item: any)=>void ): void {
        if (list) {
            let arrayCopy = list.slice(0);
            arrayCopy.forEach(callback);
        }
    }

    static removeFromArray<T>(array: T[], object: T) {
        if (array.indexOf(object) >= 0) {
            array.splice(array.indexOf(object), 1);
        }
    }

    static passiveEvents:string[] = ['touchstart','touchend','touchmove','touchcancel'];

    static addSafePassiveEventListener (eElement: HTMLElement, event: string, listener: (event?: any)=>void){
        eElement.addEventListener(event, listener, <any>(Utils.passiveEvents.indexOf(event) > -1 ? {passive:true} : null));
    }

    static loadTemplate(template: string): HTMLElement {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = template;
        return <HTMLElement> tempDiv.firstChild;
    }

        //Returns true if it is a DOM node
    //taken from: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    static isNode(o: any) {
        return (
            typeof Node === "function" ? o instanceof Node :
                o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
        );
    }

    //Returns true if it is a DOM element
    //taken from: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    static isElement(o: any) {
        return (
            typeof HTMLElement === "function" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    }

    static isNodeOrElement(o: any) {
        return this.isNode(o) || this.isElement(o);
    }

    static ensureElement(item: HTMLElement|string): HTMLElement {
        if (typeof item === 'string') {
            return this.loadTemplate(item);
        } else {
            return <HTMLElement> item;
        }
    }

    static addOrRemoveCssClass(element: HTMLElement, className: string, addOrRemove: boolean) {
        if (addOrRemove) {
            this.addCssClass(element, className);
        } else {
            this.removeCssClass(element, className);
        }
    }

    static removeCssClass(element: HTMLElement, className: string) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            if (element.className && element.className.length > 0) {
                let cssClasses = element.className.split(' ');
                if (cssClasses.indexOf(className) >= 0) {
                    // remove all instances of the item, not just the first, in case it's in more than once
                    while (cssClasses.indexOf(className) >= 0) {
                        cssClasses.splice(cssClasses.indexOf(className), 1);
                    }
                    element.className = cssClasses.join(' ');
                }
            }
        }
    }

    static addCssClass(element: HTMLElement, className: string) {
        if (!className || className.length === 0) {
            return;
        }
        if (className.indexOf(' ') >= 0) {
            className.split(' ').forEach(value => this.addCssClass(element, value));
            return;
        }
        if (element.classList) {
            element.classList.add(className);
        } else {
            if (element.className && element.className.length > 0) {
                let cssClasses = element.className.split(' ');
                if (cssClasses.indexOf(className) < 0) {
                    cssClasses.push(className);
                    element.className = cssClasses.join(' ');
                }
            } else {
                element.className = className;
            }
        }
    }
}

export class NumberSequence {
    
        private nextValue: number;
        private step: number;
    
        constructor(initValue = 0, step = 1) {
            this.nextValue = initValue;
            this.step = step;
        }
    
        public next(): number {
            let valToReturn = this.nextValue;
            this.nextValue += this.step;
            return valToReturn;
        }
    
        public peek(): number {
            return this.nextValue;
        }
    
        public skip(count: number): void {
            this.nextValue += count;
        }
    }
    
    export let _ = Utils;