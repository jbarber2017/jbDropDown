import {IEvent, DropDownEvent} from './interfaces/iEvent';

export {Events} from './eventKeys';

export interface DropDownReadyEvent extends DropDownEvent {}
export interface FilterChangedEvent extends DropDownEvent {}
export interface FilterModifiedEvent extends DropDownEvent {}