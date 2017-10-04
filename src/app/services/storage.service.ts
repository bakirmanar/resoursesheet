import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    static set(key:string, value:any):void {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }

    static get(key:string):any {
        let data = localStorage.getItem(key);

        if (data && typeof data === 'string' && (data[0] === '[' || data[0] === '{')) {
            data = JSON.parse(data, function(k, v) {
                return (typeof v === "object" || isNaN(v)) ? v : parseInt(v, 10);
            });
        }

        return data === 'true' || (data === 'false' ? false : data);
    }

    static remove(key:string):void {
        localStorage.removeItem(key);
    }

    static clear():void {
        localStorage.clear();
    }
}
