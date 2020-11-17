import * as crypto from "../crypto";
import HttpRequest from "../utils/request";
import { Coin, Fee, Msg } from '../tx';
export declare const api: {
    broadcast: string;
};
/**
 * The Bitsong Network client.
 */
export declare class BitSongClient {
    _httpClient: HttpRequest;
    private _hdpath;
    private _privateKey;
    private address?;
    private chain_id;
    private addressPrefix;
    private account_number;
    private mode;
    /**
     * @param {String} server BitSong Network public url
     * @param {String} addressPrefix BitSong Address Prefix
     * @param {String} hdpath BitSong HDPATH
     * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
     * @param {Number} source where does this transaction come from (default 0)
     */
    constructor(server: string, addressPrefix?: string, hdpath?: string);
    /**
     * Set broadcast mode
     * @param {string} mode
     * @return {void}
     */
    setMode(mode: string): void;
    /**
     * Set client account.
     * @param {string} privateKey
     * @return {BitSongClient}
     */
    setAccountInfo(privateKey: string): Promise<BitSongClient>;
    /**
     * Build Transaction before broadcast.
     * @param {Object} msg
     * @param {Object} signMsg
     * @param {String} memo
     * @param {String} fee
     * @param {Number} sequenceNumber
     * @return {Transaction} Transaction object
     */
    buildTransaction(msgs: Msg[], memo: string | undefined, fee: Fee, sequence_number?: string): Promise<string>;
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {String} signedBz signed and serialized raw transaction
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    broadcast(signedBz: string): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Initialize the client with the chain's ID. Asynchronous.
     * @return {Promise}
     */
    initChain(): Promise<this>;
    /**
     * get account
     * @param {String} address
     * @return {Promise} resolves with http response
     */
    getAccount(address?: string | undefined): Promise<{
        result: any;
        status: number;
    } | null>;
    /**
     * get SequenceNumber from accountInfo Object
     * @param {String} accountInfo
     * @return {Number} sequenceNumber
     */
    getSequenceNumberFromAccountInfo(accountInfo: any): any;
    /**
     * get accountNumber from accountInfo Object
     * @param {String} accountInfo
     * @return {Number} accountNumber
     */
    getAccountNumberFromAccountInfo(accountInfo: any): any;
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
     * Generate and download an account keystore object, and returns the private key and address.
     * @param {String} privateKey
     * @param {String} password
     */
    generateAndDownloadKeyStore(privateKey: string, password: string): void;
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
    /**
     * Build and broadcast MsgSend
     * @param {String} to_address
     * @param {Coin} amount
     * @return {Promise}
     */
    send(to_address: string, amount: Coin[], memo: string | undefined, fee: Fee, sequence?: string): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Build and broadcast MsgDelegate
     * @param {String} to_address
     * @param {Coin} amount
     * @return {Promise}
     */
    delegate(validator_address: string, amount: Coin, memo: string | undefined, fee: Fee, sequence?: string): Promise<{
        result: any;
        status: number;
    }>;
}
