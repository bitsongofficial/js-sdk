import * as crypto from "../crypto"
import { convertObjectToSignBytes, sortObject } from "../utils"

export interface Coin {
  denom: string
  amount: string
}

export interface Fee {
  amount: Coin[]
  gas: string
}

export interface Msg {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

export interface PubKey {
  type: string
  value: string | Buffer
}

export interface Signature {
  pub_key: PubKey
  signature: Buffer | string
}

export interface SignedTx {
  tx: SerializedTx
  mode: string
}

export interface SerializedTx {
  fee: Fee
  memo: string | ""
  msg?: Msg[]
  signatures?: Signature[] | null
}

export interface StdSignMsg {
  account_number: string
  chain_id: string
  fee: Fee
  memo: string | ""
  msgs?: Msg[]
  sequence: string
  signatures?: Signature[] | null
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
export class Transaction {
  public chain_id: string
  public account_number: string
  public sequence: string
  public fee: Fee
  public msgs?: Msg[]
  public memo: string
  public signatures?: Signature[] | null
  public mode: string | "sync"
  constructor(
    chain_id: string,
    account_number: string,
    sequence: string,
    fee: Fee,
    memo = "",
    msgs?: Msg[],
    signatures?: Signature[] | null
  ) {
    this.chain_id = chain_id
    this.sequence = sequence
    this.account_number = account_number
    this.fee = fee
    this.msgs = msgs
    this.memo = memo
    this.signatures = signatures
    this.mode = "sync"
  }

  setMode(mode: string): void {
    this.mode = mode
  }

  getSignBytes(): Buffer {
    const signMsg: StdSignMsg = {
      account_number: this.account_number,
      chain_id: this.chain_id,
      fee: this.fee,
      memo: this.memo,
      msgs: this.msgs,
      sequence: this.sequence,
    }
    return convertObjectToSignBytes(sortObject(signMsg))
  }

  sign(privateKey: string): Transaction {
    if (!privateKey) {
      throw new Error("private key should not be null")
    }
    const signBytes = this.getSignBytes()
    const privKeyBuf = Buffer.from(privateKey, "hex")
    const signature = crypto.generateSignature(
      signBytes.toString("hex"),
      privKeyBuf
    )

    const pubKey = crypto.encodePubKeyToCompressedBuffer(
      crypto.generatePubKey(privKeyBuf)
    )

    this.signatures = [
      {
        pub_key: {
          type: "tendermint/PubKeySecp256k1",
          value: pubKey,
        },
        signature: signature,
      },
    ]
    return this
  }

  serialize(): string {
    if (!this.signatures) {
      throw new Error("signature is null")
    }

    const serializedTx: SignedTx = {
      mode: this.mode,
      tx: {
        fee: this.fee,
        memo: this.memo,
        msg: this.msgs,
        signatures: this.signatures.map((sig: Signature) => {
          sig.pub_key.value = sig.pub_key.value.toString("base64")
          sig.signature = sig.signature.toString("base64")

          return sig
        }),
      },
    }
    return JSON.stringify(sortObject(serializedTx))
  }
}
