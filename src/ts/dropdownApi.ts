import {Bean, PostConstruct} from './context/context';

@Bean('dropdownApi')
export class DropDownApi {

    @PostConstruct
    private init(): void {
        
    }
}