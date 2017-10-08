
export interface ContextParams {
    seed: any,
    beans: any[],
    components: ComponentMeta[],
    overrideBeans: any[],
    debug: boolean
}

export interface ComponentMeta {
    theClass: new()=>Object,
    componentName: string
}

interface BeanEntry {
    bean: any,
    beanInstance: any,
    beanName: any
}

export class Context {

}

// taken from: http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
// allows calling 'apply' on a constructor
function applyToConstructor(constructor: Function, argArray: any[]) {
    let args = [null].concat(argArray);
    let factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
}

export function PreConstruct(target: Object, methodName: string, descriptor: TypedPropertyDescriptor<any>): void {
    let props = getOrCreateProps(target.constructor);
    if (!props.postConstructMethods) {
        props.preConstructMethods = [];
    }
    props.preConstructMethods.push(methodName);
}

export function PostConstruct(target: Object, methodName: string, descriptor: TypedPropertyDescriptor<any>): void {
    let props = getOrCreateProps(target.constructor);
    if (!props.postConstructMethods) {
        props.postConstructMethods = [];
    }
    props.postConstructMethods.push(methodName);
}

export function PreDestroy(target: Object, methodName: string, descriptor: TypedPropertyDescriptor<any>): void {
    let props = getOrCreateProps(target.constructor);
    if (!props.preDestroyMethods) {
        props.preDestroyMethods = [];
    }
    props.preDestroyMethods.push(methodName);
}

export function Bean(beanName: string): Function {
    return (classConstructor: any) => {
        let props = getOrCreateProps(classConstructor);
        props.beanName = beanName;
    };
}

export function Autowired(name?: string): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor)=>{
        autowiredFunc(target, name, false, target, propertyKey, null)
    };
}

export function Optional(name?: string): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor)=>{
        autowiredFunc(target, name, true, target, propertyKey, null)
    };
}

function autowiredFunc(target: any, name: string, optional: boolean, classPrototype: any, methodOrAttributeName: string, index: number) {

    if (name===null) {
        console.error('jbDropDown: Autowired name should not be null');
        return;
    }
    if (typeof index === 'number') {
        console.error('jbDropDown: Autowired should be on an attribute');
        return;
    }

    // it's an attribute on the class
    let props = getOrCreateProps(target.constructor);
    if (!props.agClassAttributes) {
        props.agClassAttributes = [];
    }
    props.agClassAttributes.push({
        attributeName: methodOrAttributeName,
        beanName: name,
        optional: optional
    });
}

export function Qualifier(name: string): Function {
    return (classPrototype: any, methodOrAttributeName: string, index: number) => {

        let constructor:any = (typeof classPrototype == 'function') ? classPrototype : classPrototype.constructor;
        let props: any;

        if (typeof index === 'number') {
            // it's a parameter on a method
            let methodName: string;
            if (methodOrAttributeName) {
                props = getOrCreateProps(constructor);
                methodName = methodOrAttributeName;
            } else {
                props = getOrCreateProps(constructor);
                methodName = 'jbConstructor';
            }
            if (!props.autowireMethods) {
                props.autowireMethods = {};
            }
            if (!props.autowireMethods[methodName]) {
                props.autowireMethods[methodName] = {};
            }
            props.autowireMethods[methodName][index] = name;
        }

    };
}

function getOrCreateProps(target: any): any {
    if (!target.hasOwnProperty('__jbBeanMetaData')) {
        target.__jbBeanMetaData = {};
    }


    return target.__jbBeanMetaData;
}