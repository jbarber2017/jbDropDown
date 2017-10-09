import {DropDownApi} from '../dropdownApi';

export interface IEvent {
    type: string;
}

export interface DropDownEvent  extends IEvent {
    api: DropDownApi;
}

