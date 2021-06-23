
import { readFile } from 'fs';

/**
 * Custom type guard that checks if the variable that is given has all the given properties.
 *
 * @param varToBeChecked The variable that should be checked
 * @param propertyToCheckFor An array of properties and expected type
 * @returns true if the given object has all the given properties of the given types, false otherwise
 */
export const isOfType = <T>(
    varToBeChecked: any,
    propertyToCheckFor: [(keyof T), string][]
): varToBeChecked is T => {
    for (const [key, type] of propertyToCheckFor) {
        if (typeof (varToBeChecked as T)[key] !== type) {
            return false;
        }
    }
    return true;
}

/**
 * Read a file from the filesystem into a Buffer.
 * 
 * @param filename The name of the file to read
 * @returns A promise resolving to the Buffer containing the file contents
 */
export function readFileBuffer(filename: string): Promise<Buffer> {
    return asyncify(readFile, filename);
}

/**
 * Call a function that takes a callback as its last parameter and return a promise that resolves
 * once the callback is called.
 * 
 * @param func The base function that uses callbacks
 * @param args The arguments to the original function, besides the callback
 * @returns The promise that will be resolved with the value of the callback
 */
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

