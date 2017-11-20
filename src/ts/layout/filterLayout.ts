import {Promise, Utils as _} from '../utils';

export class FilterLayout {
    private eGui: HTMLElement;
    private eBody: HTMLElement;
    private params: FilterLayoutParams;
    private item: FilterItemWrapper;
    private afterAttachedParams: any;

    private static TEMPLATE =
    '<div>'+
        '<div id="tabBody" class="ag-tab-body"></div>'+
    '</div>';

    constructor(params: FilterLayoutParams) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = FilterLayout.TEMPLATE;

        this.eBody = <HTMLElement> this.eGui.querySelector('#tabBody');

        _.addCssClass(this.eGui, params.cssClass);

        this.setItemWrapper(params.item)
    }

    private setItemWrapper(item: FilterItem): void {
        let wrapper: FilterItemWrapper = {
            item: item
        };
        this.item = wrapper;
    }

    public setAfterAttachedParams(params: any): void {
        this.afterAttachedParams = params;
    }

    public getMinWidth(): number {
        let eDummyContainer = document.createElement('span');
        // position fixed, so it isn't restricted to the boundaries of the parent
        eDummyContainer.style.position = 'fixed';

        // we put the dummy into the body container, so it will inherit all the
        // css styles that the real cells are inheriting
        this.eGui.appendChild(eDummyContainer);

        let minWidth = 0;
        _.removeAllChildren(eDummyContainer);
        let eClone: HTMLElement = <HTMLElement>this.item.item.bodyPromise.resolveNow(null, body=>body.cloneNode(true));
        if(eClone === null) return;

        eDummyContainer.appendChild(eClone);

        if(minWidth < eDummyContainer.offsetWidth) {
            minWidth = eDummyContainer.offsetWidth;
        }

        this.eGui.removeChild(eDummyContainer);

        return minWidth;
    }

    public showItem() {
        _.removeAllChildren(this.eBody);
        this.item.item.bodyPromise.then(body => {
            this.eBody.appendChild(body);
        });

        if(this.item.item.afterAttachedCallback) {
            this.item.item.afterAttachedCallback(this.afterAttachedParams);
        }
    }

    public getGui(): HTMLElement {
        return this.eGui;
    }
}

export interface TabbedLayoutParams {
    items: TabbedItem[],
    cssClass?: string,
    onItemClicked?: Function
    onActiveItemClicked?: Function
}

export interface FilterLayoutParams {
    item: FilterItem,
    cssClass?: string,
    onItemClicked?: Function,
    onActiveItemClicked?: Function
}

export interface TabbedItem {
    title: Element,
    bodyPromise: Promise<HTMLElement>,
    name: string,
    afterAttachedCallback?: Function
}

export interface FilterItem {
    //title: Element,
    bodyPromise: Promise<HTMLElement>,
    name: string,
    afterAttachedCallback?: Function
}

interface TabbedItemWrapper {
    tabbedItem: TabbedItem,
    eHeaderButton: HTMLElement
}

interface FilterItemWrapper {
    item: FilterItem,
}