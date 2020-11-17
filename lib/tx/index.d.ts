/// <reference types="node" />
export interface Coin {
    denom: string;
    amount: string;
}
export interface Fee {
    amount: Coin[];
    gas: string;
}
export interface Msg {
    type: string;
    value: any;
}
export interface PubKey {
    type: string;
    value: string | Buffer;
}
export interface Signature {
    pub_key: PubKey;
    signature: Buffer | string;
}
export interface SignedTx {
    tx: SerializedTx;
    mode: string;
}
export interface SerializedTx {
    fee: Fee;
    memo: string | "";
    msg?: Msg[];
    signatures?: Signature[] | null;
}
export interface StdSignMsg {
    account_number: string;
    chain_id: string;
    fee: Fee;
    memo: string | "";
    msgs?: Msg[];
    sequence: string;
    signatures?: Signature[] | null;
}
/**
 * Transaction
 * @param {String} param.account_number
 * @param {String} param.chain_id
 * @param {Object} param.fee
 * @param {String} param.memo
 * @param {Object} param.msg
 * @param {String} param.sequence
 */
export declare class Transaction {
    chain_id: string;
    account_number: string;
    sequence: string;
    fee: Fee;
    msgs?: Msg[];
    memo: string;
    signatures?: Signature[] | null;
    mode: string | "sync";
    constructor(chain_id: string, account_number: string, sequence: string, fee: Fee, memo?: string, msgs?: Msg[], signatures?: Signature[] | null);
    setMode(mode: string): void;
    getSignBytes(): Buffer;
    sign(privateKey: string): Transaction;
    serialize(): string;
}
