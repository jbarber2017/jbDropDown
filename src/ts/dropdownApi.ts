import {Bean, PostConstruct, Autowired, Context} from './context/context';

@Bean('dropdownApi')
export class DropDownApi {
    @Autowired('context') private context: Context;

    @PostConstruct
    private init(): void {
        
    }
}