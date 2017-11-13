import {Bean, Autowired, Qualifier, PreDestroy, PostConstruct} from './context/context';
import {DropDownOptions,PostProcessPopupParams} from './entities/dropdownOptions';
import {DropDownApi} from './dropdownApi';
import {Utils as _} from './utils';

@Bean('dropdownOptionsWrapper')
export class DropDownOptionsWrapper {
    @Autowired('dropdownOptions') private dropdownOptions: DropDownOptions;

    private agWire(@Qualifier('dropdownApi') dropdownApi: DropDownApi): void {
        this.dropdownOptions.api = dropdownApi;
        // this.gridOptions.columnApi = columnApi;
        // this.checkForDeprecated();
    }

    @PreDestroy
    private destroy(): void {
        // need to remove these, as we don't own the lifecycle of the dropdownOptions, we need to
        // remove the references in case the user keeps the grid options, we want the rest
        // of the grid to be picked up by the garbage collector
        this.dropdownOptions.api = null;
    }

    @PostConstruct
    public init(): void {
        // let async = this.useAsyncEvents();
        // this.eventService.addGlobalListener(this.globalEventHandler.bind(this), async);

        // if (this.isGroupSelectsChildren() && this.isSuppressParentsInRowNodes()) {
        //     console.warn('ag-Grid: groupSelectsChildren does not work wth suppressParentsInRowNodes, this selection method needs the part in rowNode to work');
        // }

        // if (this.isGroupSelectsChildren()) {
        //     if (!this.isRowSelectionMulti()) {
        //         console.warn(`ag-Grid: rowSelection must be 'multiple' for groupSelectsChildren to make sense`);
        //     }
        //     if (this.isRowModelEnterprise()) {
        //         console.warn('ag-Grid: group selects children is NOT support for Enterprise Row Model. ' +
        //             'This is because the rows are lazy loaded, so selecting a group is not possible as' +
        //             'the grid has no way of knowing what the children are.');
        //     }
        // }

        // if (this.isGroupRemoveSingleChildren() && this.isGroupHideOpenParents()) {
        //     console.warn('ag-Grid: groupRemoveSingleChildren and groupHideOpenParents do not work with each other, you need to pick one. And don\'t ask us how to us these together on our support forum either you will get the same answer!');
        // }
    }

    public getPostProcessPopupFunc(): (params: PostProcessPopupParams)=>void { return this.dropdownOptions.postProcessPopup; }

    public getDocument(): Document {
        // if user is providing document, we use the users one,
        // otherwise we use the document on the global namespace.
        let result: Document;
        if (_.exists(this.dropdownOptions.getDocument)) {
            result = this.dropdownOptions.getDocument();
        }
        if (_.exists(result)) {
            return result;
        } else {
            return document;
        }
    }
}