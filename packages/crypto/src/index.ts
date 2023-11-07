import * as sodium from 'libsodium-wrappers';
import { CryptoProvider, KeyPair } from "@jiff/common";

export class LibSodiumCrypto implements CryptoProvider {
  async generateKeyPair(): Promise<KeyPair> {
    await sodium.ready;
    return sodium.crypto_sign_keypair();
  }
}
