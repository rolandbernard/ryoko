
import { readFileBuffer } from './util';
import { keys } from './config';

let privateKey: Buffer;

export async function getPrivateKey(): Promise<Buffer> {
    if (!privateKey) {
        privateKey = await readFileBuffer(keys.private);
    }
    return privateKey;
}

let publicKey: Buffer;

export async function getPublicKey(): Promise<Buffer> {
    if (!publicKey) {
        publicKey = await readFileBuffer(keys.public);
    }
    return publicKey;
}

