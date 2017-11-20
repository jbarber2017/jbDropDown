import {Bean, Autowired, Context} from '../context/context';
import {PopupService} from '../widgets/popupService';
import {EventService} from '../eventService';
import {FilterChangedEvent, FilterModifiedEvent, Events} from '../events';
import {DropDownApi} from '../dropdownApi';
import {DropDownOptionsWrapper} from '../dropdownOptionsWrapper';
import {DropDownCore} from '../dropdownCore';
import { DropDown } from '../dropdown';
import {IFilterComp, IFilterParams} from '../interfaces/iFilter';
import {ExternalPromise, Promise, Utils as _} from '../utils';
import {ComponentResolver} from '../components/framework/componentResolver';

@Bean('filterManager')
export class FilterManager {
    @Autowired('$compile') private $compile: any;
    @Autowired('$scope') private $scope: any;
    @Autowired('dropdownOptionsWrapper') private dropdownOptionsWrapper: DropDownOptionsWrapper;
    @Autowired('dropdownCore') private dropdownCore: DropDownCore;
    @Autowired('popupService') private popupService: PopupService;
    // @Autowired('valueService') private valueService: ValueService;
    // @Autowired('columnController') private columnController: ColumnController;
    // @Autowired('rowModel') private rowModel: IRowModel;
    @Autowired('eventService') private eventService: EventService;
    @Autowired('context') private context: Context;
    @Autowired('dropdownApi') private dropdownApi: DropDownApi;
    @Autowired('componentResolver') private componentResolver: ComponentResolver;

    private cachedFilter: FilterWrapper;


    public getOrCreateFilterWrapper(): FilterWrapper {
        let filterWrapper:FilterWrapper = this.cachedFilter;

        if (!filterWrapper) {
            filterWrapper = this.createFilterWrapper();
            //this.allFilters[column.getColId()] = filterWrapper;
        }

        return filterWrapper;

    }

    private createFilterWrapper(): FilterWrapper {
        let filterWrapper: FilterWrapper = {
            //column: column,
            filterPromise: null,
            scope: <any> null,
            guiPromise: Promise.external<HTMLElement>()
        };

        filterWrapper.scope = null;//this.gridOptionsWrapper.isAngularCompileFilters() ? this.$scope.$new() : null;

        filterWrapper.filterPromise = this.createFilterInstance(filterWrapper.scope);

        this.putIntoGui(filterWrapper);

        return filterWrapper;
    }

    public onFilterChanged(): void {
        //this.setAdvancedFilterPresent();
        //this.updateFilterFlagInColumns();
        //this.checkExternalFilter();

        // _.iterateObject(this.allFilters, function (key, filterWrapper:FilterWrapper) {
        //     filterWrapper.filterPromise.then(filter=>{
        //         if (filter.onAnyFilterChanged) {
        //             filter.onAnyFilterChanged();
        //         }
        //     })
        // });

        let event: FilterChangedEvent = {
            type: Events.EVENT_FILTER_CHANGED,
            api: this.dropdownApi,
            //columnApi: this.columnApi
        };
        this.eventService.dispatchEvent(event);
    }

    private createFilterInstance($scope:any): Promise<IFilterComp> {
        let defaultFilter:string = 'setFilter';

        // if (this.gridOptionsWrapper.isEnterprise()) {
        //     defaultFilter = 'setColumnFilter';
        // }
        //let sanitisedColDef:ColDef = _.cloneObject(column.getColDef());

        let event: FilterModifiedEvent = {
            type: Events.EVENT_FILTER_MODIFIED,
            api: this.dropdownApi,
            //columnApi: this.columnApi
        };

        // this.translateFilter(sanitisedColDef, 'set');
        // this.translateFilter(sanitisedColDef, 'text');
        // this.translateFilter(sanitisedColDef, 'number');
        // this.translateFilter(sanitisedColDef, 'date');

        let filterChangedCallback = this.onFilterChanged.bind(this);
        let filterModifiedCallback = () => this.eventService.dispatchEvent(event);

        let params: IFilterParams = {
            //column: column,
            //colDef: sanitisedColDef,
            //rowModel: this.rowModel,
            filterChangedCallback: filterChangedCallback,
            filterModifiedCallback: filterModifiedCallback,
            valueGetter: null,//this.createValueGetter(column),
            context: this.dropdownOptionsWrapper.getContext(),
            doesRowPassOtherFilter: null,
            $scope: $scope
        };

        return this.componentResolver.createAgGridComponent<IFilterComp>(
            null,
            params,
            'filter',
            defaultFilter,
            true,
            (params, filter)=>_.assign(params, {
                doesRowPassOtherFilter: this.doesRowPassOtherFilters.bind(this, filter),
            })
        );
    }

    private putIntoGui(filterWrapper: FilterWrapper): void {
        let eFilterGui = document.createElement('div');
        eFilterGui.className = 'ag-filter';
        filterWrapper.filterPromise.then(filter=>{
            let guiFromFilter = filter.getGui();

            // for backwards compatibility with Angular 1 - we
            // used to allow providing back HTML from getGui().
            // once we move away from supporting Angular 1
            // directly, we can change this.
            if (typeof guiFromFilter === 'string') {
                guiFromFilter = _.loadTemplate(<string>guiFromFilter);
            }

            eFilterGui.appendChild(guiFromFilter);

            if (filterWrapper.scope) {
                filterWrapper.guiPromise.resolve(this.$compile(eFilterGui)(filterWrapper.scope)[0]);
            } else {
                filterWrapper.guiPromise.resolve(eFilterGui);
            }
        })
    }

    public doesRowPassOtherFilters(filterToSkip: any, node: any): boolean {
        return this.doesRowPassFilter(node, filterToSkip);
    }

    public doesRowPassFilter(node: any, filterToSkip?: any): boolean {
        
                // the row must pass ALL of the filters, so if any of them fail,
                // we return true. that means if a row passes the quick filter,
                // but fails the column filter, it fails overall
                // first up, check quick filter
                // if (this.isQuickFilterPresent()) {
                //     if (!this.doesRowPassQuickFilter(node)) {
                //         return false;
                //     }
                // }
        
                // // secondly, give the client a chance to reject this row
                // if (this.externalFilterPresent) {
                //     if (!this.gridOptionsWrapper.doesExternalFilterPass(node)) {
                //         return false;
                //     }
                // }
        
                // // lastly, check our internal advanced filter
                // if (this.advancedFilterPresent) {
                //     if (!this.doesFilterPass(node, filterToSkip)) {
                //         return false;
                //     }
                // }
        
                // got this far, all filters pass
                return true;
            }
}

export interface FilterWrapper {
    filterPromise: Promise<IFilterComp>,
    scope: any,
    guiPromise: ExternalPromise<HTMLElement>
}