import {Autowired, Bean, Context, Optional, PostConstruct} from '../context/context';
//import {PopupService} from '../widgets/popupService';
import {DropDownApi} from '../dropdownApi';
import {EventService} from "../eventService";

@Bean('beans')
export class Beans {
    @Autowired('context') public context: Context;
    @Autowired('$compile') public $compile: any;
    //@Autowired('popupService') public popupService: PopupService;
    @Autowired('dropdownApi') public dropdownApi: DropDownApi;
    @Autowired('eventService') public eventService: EventService;

    @PostConstruct
    private postConstruct(): void {
    }
}