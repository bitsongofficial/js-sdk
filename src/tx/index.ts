//import * as crypto from "../crypto"
import { convertObjectToSignBytes } from "../utils"

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

export interface Signature {
  pub_key: Buffer
  signature: Buffer
}

export interface SignedTx {
  tx: StdSignMsg
  mode: string
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
class Transaction {
  public chain_id: string
  public account_number: string
  public sequence: string
  public fee: Fee
  public msgs?: Msg[]
  public memo: string
  public signatures?: Signature[] | null
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
    return convertObjectToSignBytes(signMsg)
  }

  sign(privateKey: string) {
    if (!privateKey) {
      throw new Error("private key should not be null")
    }
    // const signBytes = this.getSignBytes()
    // const privKeyBuf = Buffer.from(privateKey, "hex")
    // const signature = crypto.generateSignature(
    //   signBytes.toString("hex"),
    //   privKeyBuf
    // )
    // TODO: fix signature types
    // this.signatures = [
    //   {
    //     pub_key: crypto.generatePubKey(privKeyBuf),
    //     signature: signature,
    //   },
    // ]
    return this
  }

  serialize(mode = "sync"): string {
    if (!this.signatures) {
      throw new Error("signature is null")
    }

    const serializedTx: SignedTx = {
      tx: {
        account_number: this.account_number,
        chain_id: this.chain_id,
        sequence: this.sequence,
        fee: this.fee,
        msgs: this.msgs,
        // signatures: this.signatures.map(s => {
        //   s.pub_key.value
        // }),
        memo: this.memo,
      },
      mode: mode,
    }
    return JSON.stringify(serializedTx)
  }
}

export default Transaction
