import {IEventEmitter} from './interfaces/iEventEmitter';
import {Logger, LoggerFactory} from "./logger";
import {Qualifier, Bean} from './context/context';
import {IEvent} from './interfaces/iEvent';
import {Utils as _} from './utils';

@Bean('eventService')
export class EventService implements IEventEmitter {
    private allSyncListeners: {[key: string]: Function[]} = {};
    private allAsyncListeners: {[key: string]: Function[]} = {};

    private globalSyncListeners: Function[] = [];
    private globalAsyncListeners: Function[] = [];

    private logger: Logger;

    private asyncFunctionsQueue: Function[] = [];
    private scheduled = false;

    // this is an old idea I had, should really take it out, was to do with ordering who gets to process
    // events first, to give model and service objects preference over the view
    private static PRIORITY = '-P1';

    // because this class is used both inside the context and outside the context, we do not
    // use autowired attributes, as that would be confusing, as sometimes the attributes
    // would be wired, and sometimes not.
    //
    // the global event servers used by ag-Grid is autowired by the context once, and this
    // setBeans method gets called once.
    //
    // the times when this class is used outside of the context (eg RowNode has an instance of this
    // class) then it is not a bean, and this setBeans method is not called.
    public setBeans(@Qualifier('loggerFactory') loggerFactory: LoggerFactory,
                    //@Qualifier('gridOptionsWrapper') gridOptionsWrapper: GridOptionsWrapper,
                   @Qualifier('globalEventListener') globalEventListener: Function = null) {
        this.logger = loggerFactory.create('EventService');

        if (globalEventListener) {
            //let async = gridOptionsWrapper.useAsyncEvents();
            //this.addGlobalListener(globalEventListener, async);
        }
    }

    private getListenerList(eventType: string, async: boolean): Function[] {
        let listenerMap = async ? this.allAsyncListeners : this.allSyncListeners;
        let listenerList = listenerMap[eventType];
        if (!listenerList) {
            listenerList = [];
            listenerMap[eventType] = listenerList;
        }
        return listenerList;
    }

    public addEventListener(eventType: string, listener: Function, async = false): void {
        if (! this.assertNotDeprecated(eventType)) return;

        let listenerList = this.getListenerList(eventType, async);
        if (listenerList.indexOf(listener)<0) {
            listenerList.push(listener);
        }
    }

    private assertNotDeprecated(eventType:string):boolean{
        if (eventType==='floatingRowDataChanged') {
            console.warn('ag-Grid: floatingRowDataChanged is now called pinnedRowDataChanged');
            return false;
        } else {
            return true;
        }
    }

    // for some events, it's important that the model gets to hear about them before the view,
    // as the model may need to update before the view works on the info. if you register
    // via this method, you get notified before the view parts
    public addModalPriorityEventListener(eventType: string, listener: Function, async = false): void {
        if (! this.assertNotDeprecated(eventType)) return;
        this.addEventListener(eventType + EventService.PRIORITY, listener, async);
    }

    public addGlobalListener(listener: Function, async = false): void {
        if (async) {
            this.globalAsyncListeners.push(listener);
        } else {
            this.globalSyncListeners.push(listener);
        }
    }

    public removeEventListener(eventType: string, listener: Function, async = false): void {
        let listenerList = this.getListenerList(eventType, async);
        _.removeFromArray(listenerList, listener);
    }

    public removeGlobalListener(listener: Function): void {
        _.removeFromArray(this.globalSyncListeners, listener);
    }

    // why do we pass the type here? the type is in ColumnChangeEvent, so unless the
    // type is not in other types of events???
    public dispatchEvent(event: IEvent): void {
        // console.log(`dispatching ${eventType}: ${event}`);
        this.dispatchToListeners(event, true);
        this.dispatchToListeners(event, false);
    }

    private dispatchToListeners(event: IEvent, async: boolean) {

        let globalListeners = async ? this.globalAsyncListeners : this.globalSyncListeners;
        let eventType = event.type;

        // this allows the columnController to get events before anyone else
        let p1ListenerList = this.getListenerList(eventType + EventService.PRIORITY, async);
        _.forEachSnapshotFirst(p1ListenerList, listener => {
            if (async) {
                this.dispatchAsync( () => listener(event) );
            } else {
                listener(event);
            }
        });

        let listenerList = this.getListenerList(eventType, async);
        _.forEachSnapshotFirst(listenerList,listener => {
            if (async) {
                this.dispatchAsync( () => listener(event) );
            } else {
                listener(event);
            }
        });

        _.forEachSnapshotFirst(globalListeners, listener => {
            if (async) {
                this.dispatchAsync( () => listener(eventType, event) );
            } else {
                listener(eventType, event);
            }
        });
    }

    // this gets called inside the grid's thread, for each event that it
    // wants to set async. the grid then batches the events into one setTimeout()
    // because setTimeout() is an expensive operation. ideally we would have
    // each event in it's own setTimeout(), but we batch for performance.
    private dispatchAsync(func: Function): void {

        // add to the queue for executing later in the next VM turn
        this.asyncFunctionsQueue.push(func);

        // check if timeout is already scheduled. the first time the grid calls
        // this within it's thread turn, this should be false, so it will schedule
        // the 'flush queue' method the first time it comes here. then the flag is
        // set to 'true' so it will know it's already scheduled for subsequent calls.
        if (!this.scheduled) {
            // if not scheduled, schedule one
            setTimeout(this.flushAsyncQueue.bind(this), 0);
            // mark that it is scheduled
            this.scheduled = true;
        }
    }

    // this happens in the next VM turn only, and empties the queue of events
    private flushAsyncQueue(): void {
        this.scheduled = false;

        // we take a copy, because the event listener could be using
        // the grid, which would cause more events, which would be potentially
        // added to the queue, so safe to take a copy, the new events will
        // get executed in a later VM turn rather than risk updating the
        // queue as we are flushing it.
        let queueCopy = this.asyncFunctionsQueue.slice();
        this.asyncFunctionsQueue = [];

        // execute the queue
        queueCopy.forEach( func => func() );
    }
}