import * as crypto from "../crypto";
export declare const NETWORK_PREFIX_MAPPING: {
    readonly testnet: "bitsong";
    readonly mainnet: "bitsong";
};
/**
 * The Bitsong Network client.
 */
export declare class BitSongClient {
    addressPrefix: typeof NETWORK_PREFIX_MAPPING[keyof typeof NETWORK_PREFIX_MAPPING];
    address?: string;
    private _privateKey;
    /**
     * @param {String} server BitSong Network public url
     * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
     * @param {Number} source where does this transaction come from (default 0)
     */
    constructor(server: string);
    /**
     * Creates a private key and returns it and its address.
     * @return {object} the private key and address in an object.
     * {
     *  address,
     *  privateKey
     * }
     */
    createAccount(): {
        privateKey: string;
        address: string;
    };
    /**
     * Creates an account keystore object, and returns the private key and address.
     * @param {String} password
     *  {
     *  privateKey,
     *  address,
     *  keystore
     * }
     */
    createAccountWithKeystore(password: string): {
        privateKey: string;
        address: string;
        keystore: crypto.KeyStore;
    };
    /**
     * Creates an account from mnemonic seed phrase.
     * @return {object}
     * {
     *  privateKey,
     *  address,
     *  mnemonic
     * }
     */
    createAccountWithMneomnic(): {
        privateKey: string;
        address: string;
        mnemonic: string;
    };
    /**
     * Recovers an account from a keystore object.
     * @param {object} keystore object.
     * @param {string} password password.
     * {
     * privateKey,
     * address
     * }
     */
    recoverAccountFromKeystore(keystore: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[0], password: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[1]): {
        privateKey: string;
        address: string;
    };
    /**
     * Recovers an account from a mnemonic seed phrase.
     * @param {string} mneomnic
     * {
     * privateKey,
     * address
     * }
     */
    recoverAccountFromMnemonic(mnemonic: string): {
        privateKey: string;
        address: string;
    };
    recoverAccountFromMneomnic(mnemonic: string): {
        privateKey: string;
        address: string;
    };
    /**
     * Recovers an account using private key.
     * @param {String} privateKey
     * {
     * privateKey,
     * address
     * }
     */
    recoverAccountFromPrivateKey(privateKey: string): {
        privateKey: string;
        address: string;
    };
    /**
     * Validates an address.
     * @param {String} address
     * @param {String} prefix
     * @return {Boolean}
     */
    checkAddress(address: string, prefix?: BitSongClient["addressPrefix"]): boolean;
    /**
     * Returns the address for the current account if setPrivateKey has been called on this client.
     * @return {String}
     */
    getClientKeyAddress(): string;
}
