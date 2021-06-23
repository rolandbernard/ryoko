
import { readFileBuffer } from './util';
import { env } from 'process';
import { keys } from './config';

let hasKeys: boolean | null = null;

/**
 * Test if the server can find a public and private key pair.
 * 
 * @returns A promise that resolves to true if the keys are found, false otherwise
 */
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

/**
 * Get the secret with which to sign. The secret should be used a backup, if we can not locate
 * a private and public key pair.
 * 
 * @returns The secret string defined in the config
 */
export function getSecret(): string {
    return keys.secret;
}

let privateKey: string;

/**
 * Load the private string to be used for signing.
 * 
 * @returns A promise resolving to the private key as a string
 */
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

/**
 * Load the public string to be used for verifying signatures made with the private key.
 * 
 * @returns A promise resolving to the public key as a string
 */
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

