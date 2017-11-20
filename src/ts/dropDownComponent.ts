import {Component} from './widgets/component';
import {PostConstruct, Autowired} from './context/context';
import {RefSelector, QuerySelector, Listener} from './widgets/componentAnnotations';
import {IMenuFactory} from './interfaces/iMenuFactory';

export class DropDownComponent extends Component {
    @RefSelector('eButtonShowMainFilter') eButtonShowMainFilter: HTMLElement;

    @Autowired('menuFactory') private menuFactory: IMenuFactory;

    private static TEMPLATE = 
    '<div class="dropdown-container">' +
    '<div>' +
    '<input class="dropdown-input" readonly>' +
    '</div>' +
    '<div class="dropdown-button">' +
    '<button class="eButtonShowMainFilter" ref="eButtonShowMainFilter">' +
    '<span class="ag-icon ag-icon-filter"></span>' +
    '</button>' +
    '</div>' +
    '</div>';


    constructor() {
        super();
        // super(DropDownComponent.TEMPLATE);

        // this.addEventListeners();
    }

    @PostConstruct
    private postConstruct(): void {
        this.setTemplate(DropDownComponent.TEMPLATE);

        this.addEventListeners();
    }

    private addEventListeners():void {
        if(this.eButtonShowMainFilter) {
            this.addDestroyableEventListener(this.eButtonShowMainFilter, 'click', this.showParentFilter.bind(this));
        }
    }

    private showParentFilter(){
        this.menuFactory.showMenuAfterButtonClick(this.eButtonShowMainFilter, 'filterMenuTab', ['filterMenuTab']);
    }
}