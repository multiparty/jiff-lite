
export interface KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}
export interface CryptoProvider {
    generateKeyPair(): Promise<KeyPair>;
}