/* eslint-disable */
import * as crypto from "../crypto"
import HttpRequest from "../utils/request"
import { v4 as uuidv4 } from 'uuid';
import FileSaver from "file-saver"
import { Transaction, Coin, Fee, Msg } from '../tx';

export const api = {
  broadcast: "/txs",
}

/**
 * The Bitsong Network client.
 */
export class BitSongClient {

  public _httpClient: HttpRequest
  private _hdpath: string | string = `44'/118'/0'/0/`
  private _privateKey: string
  private address?: string
  private chain_id: string
  private addressPrefix: string | string = 'bitsong'
  private account_number: string
  private mode: string

  /**
   * @param {String} server BitSong Network public url
   * @param {String} addressPrefix BitSong Address Prefix
   * @param {String} hdpath BitSong HDPATH
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  constructor(server: string, addressPrefix?: string, hdpath?: string) {
    if (!server) {
      throw new Error("BitSong chain server should not be null")
    }
    this._httpClient = new HttpRequest(server)

    if (addressPrefix) {
      this.addressPrefix = addressPrefix
    }

    if (hdpath) {
      this._hdpath = hdpath
    }

    this.chain_id = ""
    this._privateKey = ""
    this.account_number = ""
    this.mode = "sync"
  }

  /**
   * Set broadcast mode
   * @param {string} mode
   * @return {void}
   */
  setMode(mode: string):void {
    this.mode = mode
  }

  /**
   * Set client account.
   * @param {string} privateKey
   * @return {BitSongClient}
   */
  async setAccountInfo(privateKey: string): Promise<BitSongClient> {
    if (privateKey !== this._privateKey) {
        const address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)
        if (!address) throw new Error("invalid privateKey: " + privateKey)
        if (address === this.address) return this
        this._privateKey = privateKey
        this.address = address
        const account = await this.getAccount(address)
        this.account_number = await this.getAccountNumberFromAccountInfo(account)
    }
    return this
}

  /**
   * Build Transaction before broadcast.
   * @param {Object} msg
   * @param {Object} signMsg
   * @param {String} memo
   * @param {String} fee
   * @param {Number} sequenceNumber
   * @return {Transaction} Transaction object
   */
  async buildTransaction(msgs: Msg[], memo = "", fee: Fee, sequence_number = ""): Promise<string> {
    if ((!this.account_number || !sequence_number)) {
        const account_info = await this.getAccount()
        sequence_number = this.getSequenceNumberFromAccountInfo(account_info)
        this.account_number = this.getAccountNumberFromAccountInfo(account_info)
    }

    const tx = new Transaction(this.chain_id, this.account_number, sequence_number, fee, memo, msgs)
    tx.setMode(this.mode)
    return tx.sign(this._privateKey).serialize()
}

  /**
   * Broadcast a raw transaction to the blockchain.
   * @param {String} signedBz signed and serialized raw transaction
   * @param {Boolean} sync use synchronous mode, optional
   * @return {Promise} resolves with response (success or fail)
   */
  async broadcast(signedBz: string): Promise<{result: any, status: number}> {
    const opts = {
      data: signedBz,
      headers: {
        "content-type": "text/plain",
      },
    }
    const response = await this._httpClient.request(
      "post",
      `${api.broadcast}`,
      null,
      opts
    )
    return response
  }

  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */
  async initChain() {
    if (!this.chain_id) {
      const data = await this._httpClient.request("get", "node_info")
      this.chain_id = data.result.node_info && data.result.node_info.network
    }
    return this
  }

  /**
   * get account
   * @param {String} address
   * @return {Promise} resolves with http response
   */
  async getAccount(address = this.address) {
    if (!address) {
      throw new Error("address should not be empty")
    }

    try {
      const data = await this._httpClient.request(
        "get",
        `auth/accounts/${address}`
      )
      return data
    } catch (err) {
      return null
    }
  }

  /**
   * get SequenceNumber from accountInfo Object
   * @param {String} accountInfo
   * @return {Number} sequenceNumber
   */
  getSequenceNumberFromAccountInfo(accountInfo: any) {
    return accountInfo.result.result.value.sequence
  }

  /**
   * get accountNumber from accountInfo Object
   * @param {String} accountInfo
   * @return {Number} accountNumber
   */
  getAccountNumberFromAccountInfo(accountInfo: any) {
    return accountInfo.result.result.value.account_number
  }

  /**
   * Creates a private key and returns it and its address.
   * @return {object} the private key and address in an object.
   * {
   *  address,
   *  privateKey
   * }
   */
  createAccount() {
    const privateKey = crypto.generatePrivateKey()
    return {
      privateKey,
      address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix),
    }
  }

  /**
   * Creates an account keystore object, and returns the private key and address.
   * @param {String} password
   *  {
   *  privateKey,
   *  address,
   *  keystore
   * }
   */
  createAccountWithKeystore(password: string) {
    if (!password) {
      throw new Error("password should not be falsy")
    }
    const privateKey = crypto.generatePrivateKey()
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    const keystore = crypto.generateKeyStore(privateKey, password)
    return {
      privateKey,
      address,
      keystore,
    }
  }


  /**
   * Generate and download an account keystore object, and returns the private key and address.
   * @param {String} privateKey
   * @param {String} password
   */
  generateAndDownloadKeyStore(privateKey: string, password: string) {
    if (!privateKey) {
      throw new Error("password should not be falsy")
    }
    if (!password) {
      throw new Error("password should not be falsy")
    }
    const keystore = crypto.generateKeyStore(privateKey, password)

    const uuid = uuidv4()
    const blob = new Blob([JSON.stringify(keystore)], {
      type: "text/plain;charset=utf-8"
    })

    return FileSaver.saveAs(blob, `${uuid}_keystore.txt`)
  }

  /**
   * Creates an account from mnemonic seed phrase.
   * @return {object}
   * {
   *  privateKey,
   *  address,
   *  mnemonic
   * }
   */
  createAccountWithMneomnic() {
    const mnemonic = crypto.generateMnemonic()
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, this._hdpath)
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address,
      mnemonic,
    }
  }

  /**
   * Recovers an account from a keystore object.
   * @param {object} keystore object.
   * @param {string} password password.
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromKeystore(
    keystore: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[0],
    password: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[1]
  ) {
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address,
    }
  }

  /**
   * Recovers an account from a mnemonic seed phrase.
   * @param {string} mneomnic
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromMnemonic(mnemonic: string) {
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, this._hdpath)
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address,
    }
  }
  // support an old method name containing a typo
  recoverAccountFromMneomnic(mnemonic: string) {
    return this.recoverAccountFromMnemonic(mnemonic)
  }

  /**
   * Recovers an account using private key.
   * @param {String} privateKey
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromPrivateKey(privateKey: string) {
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address,
    }
  }

  /**
   * Validates an address.
   * @param {String} address
   * @param {String} prefix
   * @return {Boolean}
   */
  checkAddress(
    address: string,
    prefix: BitSongClient["addressPrefix"] = this.addressPrefix
  ) {
    return crypto.checkAddress(address, prefix)
  }

  /**
   * Returns the address for the current account if setPrivateKey has been called on this client.
   * @return {String}
   */
  getClientKeyAddress() {
    if (!this._privateKey)
      throw new Error("no private key is set on this client")
    const address = crypto.getAddressFromPrivateKey(
      this._privateKey,
      this.addressPrefix
    )
    this.address = address
    return address
  }

  /**
   * Build and broadcast MsgSend
   * @param {String} to_address
   * @param {Coin} amount
   * @return {Promise}
   */
  async send(to_address: string, amount: Coin[], memo: string = "", fee: Fee, sequence: string = ""): Promise<{result: any, status: number}> {
    const msg: Msg = {
      type: "cosmos-sdk/MsgSend",
      value: {
        amount: amount,
        from_address: this.address,
        to_address: to_address,
      },
    }

    if (sequence === "") {
      const account = await this.getAccount(this.address)
      sequence = this.getSequenceNumberFromAccountInfo(account)
    }

    const signedTx = await this.buildTransaction([msg], memo, fee)
    return this.broadcast(signedTx)
  }

  /**
   * Build and broadcast MsgDelegate
   * @param {String} to_address
   * @param {Coin} amount
   * @return {Promise}
   */
  async delegate(validator_address: string, amount: Coin, memo: string = "", fee: Fee, sequence: string = ""): Promise<{result: any, status: number}> {
    const msg: Msg = {
      type: "cosmos-sdk/MsgDelegate",
      value: {
        delegator_address: this.address,
        validator_address: validator_address,
        amount: amount,
      },
    }

    if (sequence === "") {
      const account = await this.getAccount(this.address)
      sequence = this.getSequenceNumberFromAccountInfo(account)
    }

    const signedTx = await this.buildTransaction([msg], memo, fee)
    return this.broadcast(signedTx)
  }
}
