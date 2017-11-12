import {Bean, Autowired, Qualifier, PostConstruct} from './context/context';
import {DropDownOptions} from './entities/dropdownOptions';
import {Logger, LoggerFactory} from './logger';

@Bean('dropdownCore')
export class DropDownCore {
    @Autowired('dropdownOptions') private dropDownOptions: DropDownOptions;
    @Autowired('eDropDownDiv') private eDropDownDiv: HTMLElement;

    private logger: Logger;
    private eRootPanel: HTMLElement;

    constructor(@Qualifier('loggerFactory') loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create('DropDownCore');
    }

    @PostConstruct
    public init(): void {
    }

    public getRootGui(): HTMLElement {
        return this.eRootPanel;
        //return this.eRootPanel.getGui();
    }

    public doLayout() {

    }
}