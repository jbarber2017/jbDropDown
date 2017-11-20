import {DropDownOptions} from './entities/dropdownOptions';
import {Context, ContextParams} from "./context/context";
import {Logger, LoggerFactory} from "./logger";
import {EventService} from "./eventService";
import {Events} from './eventKeys';
import {DropDownReadyEvent} from './events';
import {Environment} from './environment';
import {DropDownApi} from './dropdownApi';
import {DropDownCore} from './dropdownCore';
import {Beans} from './rendering/beans';
import {DropDownOptionsWrapper} from './dropdownOptionsWrapper';
import {PopupService} from './widgets/popupService';
import {MenuFactory} from './menu/menuFactory';
import {ComponentProvider} from './components/framework/componentProvider';
import {AgComponentUtils} from './components/framework/agComponentUtils';
import {ComponentMetadataProvider} from './components/framework/componentMetadataProvider';
import { ComponentResolver } from './components/framework/componentResolver';
import {NamedComponentResolver} from './components/framework/namedComponentResolver';
import {FilterManager} from './filter/filterManager';

export interface DropDownParams {
    // used by Web Components
    globalEventListener?: Function;

    // these are used by ng1 only
    $scope?: any;
    $compile?: any;
    quickFilterOnScope?: any;

    // this allows the base frameworks (React, NG2, etc) to provide alternative cellRenderers and cellEditors
    //frameworkFactory?: IFrameworkFactory;

    //bean instances to add to the context
    seedBeanInstances?: {[key:string]:any}
}

export class DropDown {
    private context: Context;

    constructor(eDropDownDiv: HTMLElement, dropDownOptions: DropDownOptions, params?: DropDownParams) {
        if (!eDropDownDiv) {
            console.error('jbDropDown: no div element provided to the DropDown');
        }
        if (!dropDownOptions) {
            console.error('jbDropDown: no dropDownOptions provided to the DropDown');
        }

        // let frameworkFactory = params ? params.frameworkFactory : null;
        // if (_.missing(frameworkFactory)) {
        //     frameworkFactory = new BaseFrameworkFactory();
        // }

        let seed = {
            dropdownOptions: dropDownOptions,
            eDropDownDiv: eDropDownDiv,
            $scope: params ? params.$scope : null,
            $compile: params ? params.$compile : null,
            quickFilterOnScope: params ? params.quickFilterOnScope : null,
            globalEventListener: params ? params.globalEventListener : null,
        };

        let contextParams = <ContextParams>{
            // overrideBeans: overrideBeans,
             seed: seed,
            // //Careful with the order of the beans here, there are dependencies between them that need to be kept
             beans: [/*rowModelClass, PaginationAutoPageSizeService,*/ DropDownApi, ComponentProvider, AgComponentUtils, ComponentMetadataProvider,
                 ComponentProvider, ComponentResolver, /*ComponentRecipes,*/ NamedComponentResolver,
            //     CellRendererFactory, HorizontalDragService, HeaderTemplateLoader, PinnedRowModel, DragService,
            /*     DisplayedGroupCreator,*/ EventService,DropDownOptionsWrapper, /*SelectionController,*/
                   FilterManager, /*ColumnController, PaginationProxy, RowRenderer, HeaderRenderer, ExpressionService,*/
            //     BalancedColumnTreeBuilder, CsvCreator, Downloader, XmlFactory, GridSerializer, TemplateService,
            /*     GridPanel,*/ PopupService, /*ValueCache, ValueService, AlignedGridsService,*/
                   LoggerFactory, /*ColumnUtils, AutoWidthCalculator, PopupService,*/ DropDownCore, MenuFactory, /* StandardMenuFactory,*/
            //     DragAndDropService, ColumnApi, FocusedCellController, MouseEventService,
            //     CellNavigationService, FilterStage, SortStage, FlattenStage, FilterService, RowNodeFactory,
            //     CellEditorFactory, CellRendererService, ValueFormatterService, StylingService, ScrollVisibleService,
            //     ColumnHoverService, ColumnAnimationService, SortService, AutoGroupColService, ImmutableService,
                   /*ChangeDetectionService,*/ Environment, Beans/*, AnimationFrameService, SortController*/
            ],
            // components: [
            //     {componentName: 'AgCheckbox', theClass: AgCheckbox}
            // ],
            // debug: !!gridOptions.debug
        };

        let isLoggingFunc = ()=> contextParams.debug;
        this.context = new Context(contextParams, new Logger('Context', isLoggingFunc));
    }

    private dispatchGridReadyEvent(dropDownOptions: DropDownOptions): void {
        let eventService: EventService = this.context.getBean('eventService');
        let readyEvent: DropDownReadyEvent = {
            type: Events.EVENT_DROPDOWN_READY,
            api: dropDownOptions.api,
            //columnApi: gridOptions.columnApi
        };
        eventService.dispatchEvent(readyEvent);
    }

    public destroy(): void {
        this.context.destroy();
    }
}