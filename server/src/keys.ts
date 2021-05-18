
import { readFileBuffer } from './util';
import { env } from 'process';
import { keys } from './config';

let privateKey: string;

export async function getPrivateKey(): Promise<string> {
    if (env.JWT_PRIVATE_KEY) {
        return env.JWT_PRIVATE_KEY;
    } else {
        if (!privateKey) {
            privateKey = (await readFileBuffer(keys.private)).toString();
        }
        return privateKey;
    }
}

let publicKey: string;

export async function getPublicKey(): Promise<string> {
    if (env.JWT_PUBLIC_KEY) {
        return env.JWT_PUBLIC_KEY;
    } else {
        if (!publicKey) {
            publicKey = (await readFileBuffer(keys.public)).toString();
        }
        return publicKey;
    }
}

