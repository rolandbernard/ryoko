
import { readFile } from 'fs';

export const isOfType = <T>(
    varToBeChecked: any,
    propertyToCheckFor: (keyof T)[]
): varToBeChecked is T => {
    for (const key of propertyToCheckFor) {
        if (!(varToBeChecked as T)[key]) {
            return false;
        }
    }
    return true;
}

export function readFileBuffer(filename: string): Promise<Buffer> {
    return asyncify(readFile, filename);
}

export function asyncify<T extends any[], E, R>(func: (...args: [...T, (err: E, result: R) => any]) => any, ...args: T): Promise<R> {
    return new Promise((res, rej) => {
        func(...args, (err: E, result: R) => {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}

