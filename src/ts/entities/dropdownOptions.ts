import {DropDownApi} from '../dropdownApi'

export interface DropDownOptions {
    context?: any;
    showSelectAllPanel?: boolean;
    showSearchPanel?: boolean;
    showApplyPanel?: boolean;
    showCheckSelection?: boolean;
    //dropDownMode?: DropdownMode;
    buttonText?: string;
    items: any[];
    api?: DropDownApi;
    onDropDownReady?(event?: any): void;
    postProcessPopup?:(params: PostProcessPopupParams)=>void;
    getDocument?: ()=> Document;
}

export interface PostProcessPopupParams {
    // the popup we are showing
    ePopup: HTMLElement;
    // The different types are: 'contextMenu', 'columnMenu', 'aggFuncSelect', 'popupCellEditor'
    type: string;
    // if the popup is as a result of a button click (eg menu button), this is the component that the user clicked
    eventSource?: HTMLElement;
    // if the popup is as a result of a click or touch, this is the event - eg user showing context menu
    mouseEvent?: MouseEvent|Touch;
}