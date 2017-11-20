import {IMenuFactory} from '../interfaces/iMenuFactory';
import {Bean, Autowired, PostConstruct, Context} from '../context/context';
import {PopupService} from '../widgets/popupService';
import {FilterManager, FilterWrapper} from '../filter/filterManager';
import {EventService} from '../eventService';
import {FilterLayout, FilterItem, FilterLayoutParams} from '../layout/filterLayout';

@Bean('menuFactory')
export class MenuFactory implements IMenuFactory {
    @Autowired('context') private context: Context;
    @Autowired('popupService') private popupService: PopupService;

    public showMenuAfterMouseEvent(/*column:Column,*/ mouseEvent:MouseEvent, defaultTab?:string): void {
        this.showMenu((menu: Menu)=> {
            this.popupService.positionPopupUnderMouseEvent({
                //column: column,
                type: 'columnMenu',
                mouseEvent: mouseEvent,
                ePopup: menu.getGui()
            });
            menu.showLayout();
            // if (defaultTab){
            //     menu.showTab(defaultTab);
            // }
        }, defaultTab);
    }
        
    public showMenuAfterButtonClick(/*column: Column,*/ eventSource: HTMLElement, defaultTab?:string, restrictToTabs?:string[]): void {

        this.showMenu((menu: Menu)=> {
            this.popupService.positionPopupUnderComponent({
                //column: column,
                type: 'columnMenu',
                eventSource: eventSource,
                ePopup: menu.getGui(),
                nudgeX: -9,
                nudgeY: -26,
                minWidth: menu.getMinWidth(),
                keepWithinBounds: true
            });
            menu.showLayout();
            // if (defaultTab){
            //     menu.showTab(defaultTab);
            // }
        }, defaultTab, restrictToTabs);
    }
        
    public showMenu(/*column: Column,*/ positionCallback: (menu: Menu)=>void, defaultTab?:string, restrictToTabs?:string[]): void {
        let menu = new Menu('', restrictToTabs);
        this.context.wireBean(menu);

        let eMenuGui =  menu.getGui();

        // need to show filter before positioning, as only after filter
        // is visible can we find out what the width of it is
        let hidePopup = this.popupService.addAsModalPopup(
            eMenuGui,
            true,
            () => { // menu closed callback
                menu.destroy();
            }
        );

        positionCallback(menu);

        menu.afterGuiAttached({
            hidePopup: hidePopup
        });

        // if (!defaultTab){
        //     menu.showTabBasedOnPreviousSelection();
        // }

        // menu.addEventListener(EnterpriseMenu.EVENT_TAB_SELECTED, (event: any) => {
        //     this.lastSelectedTab = event.key
        // } );

        //column.setMenuVisible(true);
    }
        
    public isMenuEnabled(/*column: Column*/): boolean {
        return true;
        //return column.getMenuTabs(EnterpriseMenu.TABS_DEFAULT).length > 0;
    }
}

export class Menu {
    @Autowired('filterManager') private filterManager: FilterManager;
    @Autowired('context') private context: Context;
    @Autowired('eventService') private eventService: EventService;

    private destroyFunctions: Function[] = [];
    private hidePopupFunc: Function;
    private layout: FilterLayout;
    private filterItem: FilterItem;

    constructor(initialSelection: string, restrictTo ?: string[]) {
        //this.initialSelection = initialSelection;

        // this.includeChecks[EnterpriseMenu.TAB_GENERAL] = ()=> true;
        // this.includeChecks[EnterpriseMenu.TAB_FILTER] = () => {
        //     let isFilterEnabled: boolean = this.gridOptionsWrapper.isEnableFilter();
        //     let isFloatingFiltersEnabled: boolean = this.gridOptionsWrapper.isFloatingFilter();
        //     let isAnyFilteringEnabled = isFilterEnabled || isFloatingFiltersEnabled;

        //     let suppressFilterForThisColumn = this.column.getColDef().suppressFilter;
        //     return isAnyFilteringEnabled && !suppressFilterForThisColumn;
        // };
        // this.includeChecks[EnterpriseMenu.TAB_COLUMNS] = ()=> true;
        //this.restrictTo = restrictTo;
    }
    
    @PostConstruct
    public init(): void {
        this.createPanel();
        this.layout = new FilterLayout({
            item: null,
            cssClass: 'ag-menu',
            onActiveItemClicked: this.onHidePopup.bind(this)
        });
    }

    private onHidePopup(): void {
        this.hidePopupFunc();
    }

    private createPanel() {
        let filterWrapper: FilterWrapper = this.filterManager.getOrCreateFilterWrapper();

        let afterFilterAttachedCallback: Function;
        filterWrapper.filterPromise.then(filter=>{
            if (filter.afterGuiAttached) {
                afterFilterAttachedCallback = filter.afterGuiAttached.bind(filter);
            }
        });

        this.filterItem = {
            //title: Utils.createIconNoSpan('filter', this.gridOptionsWrapper, this.column),
            bodyPromise: filterWrapper.guiPromise.promise,
            afterAttachedCallback: afterFilterAttachedCallback,
            name: "Test"//EnterpriseMenu.TAB_FILTER
        };

        return this.filterItem;
    }

    public destroy(): void {
        // if (this.columnSelectPanel) {
        //     this.columnSelectPanel.destroy();
        // }
        // if (this.mainMenuList) {
        //     this.mainMenuList.destroy();
        // }
        this.destroyFunctions.forEach(func => func());
    }

    public showLayout() {

    }

    public getMinWidth(): number {
        return this.layout.getMinWidth();
    }

    public afterGuiAttached(params: any): void {
        //this.tabbedLayout.setAfterAttachedParams({hidePopup: params.hidePopup});
        this.hidePopupFunc = params.hidePopup;

        // if the body scrolls, we want to hide the menu, as the menu will not appear in the right location anymore
        let onBodyScroll = (event: any) => {
            // if h scroll, popup is no longer over the column
            if (event.direction==='horizontal') {
                params.hidePopup();
            }
        };
        this.eventService.addEventListener('bodyScroll', onBodyScroll);
        this.destroyFunctions.push( ()=> this.eventService.removeEventListener('bodyScroll', onBodyScroll) );
    }

    public getGui(): HTMLElement {
        return this.layout.getGui();
    }
}