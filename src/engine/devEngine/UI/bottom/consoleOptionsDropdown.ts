import { Subject } from "rxjs";

export class ConsoleOptionsDropdown {
    private value: string;
    public selectEmitter: Subject<string> = new Subject<string>();

    constructor(private input: HTMLInputElement): void {

    }
    public setValue(value: string): void {
        this.value = value;
        this.calculateOptions(value)
    }
    private calculateOptions(value: string): void {
        if(!value) {
            return
        }
        const arr = value.split(/[^a-zA-Z0-9_]/)
        const last = arr.splice( - 1, 1)[0]
        let workingObj: { [key: string]: any } = window
        for(const key of arr) {
            if(workingObj[key] instanceof Object) {
                workingObj = workingObj[key]
            }
        }
        const options = Object.keys(workingObj).filter(key => new RegExp('^' + last).test(key))
        console.log(options)
    }
}