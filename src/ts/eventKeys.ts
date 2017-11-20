export class Events {
    public static EVENT_DROPDOWN_READY = 'dropdownReady';

    /** 2 events for filtering. The grid LISTENS for filterChanged and afterFilterChanged */
    public static EVENT_FILTER_CHANGED = 'filterChanged';

    /** Filter was change but not applied. Only useful if apply buttons are used in filters. */
    public static EVENT_FILTER_MODIFIED = 'filterModified';
}