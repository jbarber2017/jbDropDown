import {IMenuFactory} from '../interfaces/iMenuFactory';
import {Bean, Autowired, Context} from '../context/context';
import {PopupService} from '../widgets/popupService';

@Bean('menuFactory')
export class MenuFactory implements IMenuFactory {
    @Autowired('context') private context: Context;
    @Autowired('popupService') private popupService: PopupService;

    public showMenuAfterMouseEvent(/*column:Column,*/ mouseEvent:MouseEvent, defaultTab?:string): void {
        // this.showMenu(column, (menu: EnterpriseMenu)=> {
        //     this.popupService.positionPopupUnderMouseEvent({
        //         column: column,
        //         type: 'columnMenu',
        //         mouseEvent: mouseEvent,
        //         ePopup: menu.getGui()
        //     });
        //     if (defaultTab){
        //         menu.showTab(defaultTab);
        //     }
        // }, defaultTab);
    }
        
    public showMenuAfterButtonClick(/*column: Column,*/ eventSource: HTMLElement, defaultTab?:string, restrictToTabs?:string[]): void {

        // this.showMenu(column, (menu: EnterpriseMenu)=> {
        //     this.popupService.positionPopupUnderComponent({
        //         column: column,
        //         type: 'columnMenu',
        //         eventSource: eventSource,
        //         ePopup: menu.getGui(),
        //         nudgeX: -9,
        //         nudgeY: -26,
        //         minWidth: menu.getMinWidth(),
        //         keepWithinBounds: true
        //     });
        //     if (defaultTab){
        //         menu.showTab(defaultTab);
        //     }
        // }, defaultTab, restrictToTabs);
    }
        
    // public showMenu(/*column: Column,*/ positionCallback: (menu: EnterpriseMenu)=>void, defaultTab?:string, restrictToTabs?:string[]): void {
    //     let menu = new EnterpriseMenu(column, this.lastSelectedTab, restrictToTabs);
    //     this.context.wireBean(menu);

    //     let eMenuGui =  menu.getGui();

    //     // need to show filter before positioning, as only after filter
    //     // is visible can we find out what the width of it is
    //     let hidePopup = this.popupService.addAsModalPopup(
    //         eMenuGui,
    //         true,
    //         () => { // menu closed callback
    //             menu.destroy();
    //             column.setMenuVisible(false);
    //         }
    //     );

    //     positionCallback(menu);

    //     menu.afterGuiAttached({
    //         hidePopup: hidePopup
    //     });

    //     if (!defaultTab){
    //         menu.showTabBasedOnPreviousSelection();
    //     }

    //     menu.addEventListener(EnterpriseMenu.EVENT_TAB_SELECTED, (event: any) => {
    //         this.lastSelectedTab = event.key
    //     } );

    //     column.setMenuVisible(true);
    // }
        
    public isMenuEnabled(/*column: Column*/): boolean {
        return true;
        //return column.getMenuTabs(EnterpriseMenu.TABS_DEFAULT).length > 0;
    }
}