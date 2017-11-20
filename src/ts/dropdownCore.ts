import {Bean, Autowired, Qualifier, PostConstruct, PreDestroy, Context} from './context/context';
import {DropDownOptions} from './entities/dropdownOptions';
import {EventService} from './eventService';
import {Logger, LoggerFactory} from './logger';
import {Utils as _} from './utils';
import {RefSelector, QuerySelector} from './widgets/componentAnnotations';
import {DropDownComponent} from './dropDownComponent';

//<M, F extends FloatingFilterChange, PC extends IFloatingFilterParams<M, F>, P extends IFloatingFilterWrapperParams<M, F, PC>> extends BaseFilterWrapperComp<M, F, PC, P> {
@Bean('dropdownCore')
export class DropDownCore {
    @Autowired('dropdownOptions') private dropDownOptions: DropDownOptions;
    @Autowired('eventService') private eventService: EventService;
    @Autowired('eDropDownDiv') private eDropDownDiv: HTMLElement;
    @Autowired('context') private context: Context;

    private destroyFunctions: Function[] = [];
    private finished: boolean;
    private logger: Logger;
    private eRootPanel: HTMLElement;

    // private static TEMPLATE = 
    //     '<div class="dropdown-container">' +
    //     '<div>' +
    //     '<input class="dropdown-input" readonly>' +
    //     '</div>' +
    //     '<div class="dropdown-button">' +
    //     '<button class="eButtonShowMainFilter" ref="eButtonShowMainFilter">' +
    //     '<span class="ag-icon ag-icon-filter"></span>' +
    //     '</button>' +
    //     '</div>' +
    //     '</div>';

    constructor(@Qualifier('loggerFactory') loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create('DropDownCore');
    }

    @PostConstruct
    public init(): void {
        // let base:HTMLElement = _.loadTemplate(`<div class="dropdown-content" aria-hidden="true"><div class="dropdown-container" aria-hidden="true"></div></div>`);
        // this.enrichBody(base);
        var c = new DropDownComponent();
        this.context.wireBean(c);
        //var t = c.getGui().toString();
        this.eRootPanel = <HTMLElement>c.getGui(); //_.loadTemplate(c.getGui());
        //var t = this.eRootPanel.querySelector('.eButtonShowMainFilter');
        this.eDropDownDiv.appendChild(this.eRootPanel);

        //this.addEventListeners();
    }

    @PreDestroy
    private destroy() {
        this.finished = true;

        this.eDropDownDiv.removeChild(this.eRootPanel);
        this.logger.log('Grid DOM removed');

        this.destroyFunctions.forEach(func => func());
    }

    public getRootGui(): HTMLElement {
        return this.eRootPanel;
        //return this.eRootPanel.getGui();
    }

    private enrichBody(body: HTMLElement) {

    }

    public doLayout() {

    }
}