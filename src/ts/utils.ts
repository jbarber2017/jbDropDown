export class Utils {

    static exists(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        } else {
            return true;
        }
    }

    static missing(value: any): boolean {
        return !this.exists(value);
    }

    static iterateObject(object: any, callback: (key: string, value: any) => void) {
        if (this.missing(object)) {
            return;
        }
        let keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = object[key];
            callback(key, value);
        }
    }

    static mapObject<TResult>(object: any, callback: (item: any) => TResult) {
        let result: TResult[] = [];
        Utils.iterateObject(object, (key: string, value: any) => {
            result.push(callback(value));
        });
        return result;
    }

    static forEachSnapshotFirst(list: any[], callback: (item: any)=>void ): void {
        if (list) {
            let arrayCopy = list.slice(0);
            arrayCopy.forEach(callback);
        }
    }

    static removeFromArray<T>(array: T[], object: T) {
        if (array.indexOf(object) >= 0) {
            array.splice(array.indexOf(object), 1);
        }
    }
}