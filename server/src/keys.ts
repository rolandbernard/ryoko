
import { readFileBuffer } from './util';
import { env } from 'process';
import { keys } from './config';

let hasKeys: boolean | null = null;

export async function usePublicAndPrivate(): Promise<boolean> {
    if (hasKeys === null) {
        try {
            await getPrivateKey();
            await getPublicKey();
            hasKeys = true;
        } catch(e) {
            hasKeys = false;
        }
    }
    return hasKeys;
}

export function getSecret(): string {
    return keys.secret;
}

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

