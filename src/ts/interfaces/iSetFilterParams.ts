import {IFilterParams} from "./iFilter";

export interface SetFilterValuesFuncParams {
    success:(values:string[])=>void
}
export type SetFilterValuesFunc = (params:SetFilterValuesFuncParams)=>void
export type SetFilterValues = SetFilterValuesFunc | any[]

export interface ISetFilterParams extends IFilterParams {
    suppressRemoveEntries ?: boolean;
    values ?: SetFilterValues;
    cellHeight: number;
    apply: boolean;
    suppressSorting: boolean;
    newRowsAction: string;
    suppressMiniFilter:boolean;
    selectAllOnMiniFilter:boolean;
    comparator?: (a: any, b: any) => number;
    debounceMs?: number;
}