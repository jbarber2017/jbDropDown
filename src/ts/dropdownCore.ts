import {Bean, Autowired} from './context/context';
import {DropDownOptions} from './entities/dropdownOptions';

@Bean('dropdownCore')
export class DropDownCore {
    @Autowired('gridOptions') private gridOptions: DropDownOptions;
}