import {IFilterParams} from "./iFilter";

export interface ISetFilterParams extends IFilterParams {
    suppressRemoveEntries ?: boolean;
    values ?: any;
    cellHeight: number;
    apply: boolean;
    suppressSorting: boolean;
    newRowsAction: string;
    suppressMiniFilter:boolean;
    selectAllOnMiniFilter:boolean;
    comparator?: (a: any, b: any) => number;
    debounceMs?: number;
}