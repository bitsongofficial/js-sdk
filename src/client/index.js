/**
 * @module client
 */
import * as crypto from "../crypto"
import HttpRequest from "../utils/request"
import Big from "big.js"
import { checkNumber } from "../utils/validateHelper"

const BASENUMBER = Math.pow(10, 6)

/**
 * The Bitsong Network client.
 */
export class BitSongClient {
  /**
   * @param {String} server Binance Chain public url
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  constructor(server = null, useAsyncBroadcast = false, source = 0) {
    if (!server) {
      throw new Error("BitSong Network Server should not be null")
    }
    this.addressPrefix = "bitsong"
    this._httpClient = new HttpRequest(server)
    // this._httpClient = new HttpRequest(server)
    // this._signingDelegate = DefaultSigningDelegate
    // this._broadcastDelegate = DefaultBroadcastDelegate
    // this._useAsyncBroadcast = useAsyncBroadcast
    // this._source = source
    // this.tokens = new TokenManagement(this)
    // this.swap = new Swap(this)
    // this.gov = new Gov(this)
  }

  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */
  async initChain() {
    if (!this.chainId) {
      const data = await this._httpClient.request("get", api.nodeInfo)
      this.chainId = data.result.node_info && data.result.node_info.network
    }
    return this
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
      address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)
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
  createAccountWithKeystore(password) {
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
      keystore
    }
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
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address,
      mnemonic
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
  recoverAccountFromKeystore(keystore, password) {
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address
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
  recoverAccountFromMnemonic(mnemonic) {
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address
    }
  }

  /**
   * Recovers an account using private key.
   * @param {String} privateKey
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromPrivateKey(privateKey) {
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      this.addressPrefix
    )
    return {
      privateKey,
      address
    }
  }

  /**
   * Validates an address.
   * @param {String} address
   * @param {String} prefix
   * @return {Boolean}
   */
  checkAddress(address, prefix = this.addressPrefix) {
    return crypto.checkAddress(address, prefix)
  }

  /**
   * Returns the address for the current account if setPrivateKey has been called on this client.
   * @return {String}
   */
  getClientKeyAddress() {
    if (!this.privateKey)
      throw new Error("no private key is set on this client")
    const address = crypto.getAddressFromPrivateKey(
      this.privateKey,
      this.addressPrefix
    )
    this.address = address
    return address
  }

  /**
   * Send tokens from one address to another.
   * @param {String} fromAddress
   * @param {String} toAddress
   * @param {Number} amount
   * @param {String} asset
   * @param {String} memo optional memo
   * @param {Number} sequence optional sequence
   * @return {Promise} resolves with response (success or fail)
   */
  async send(fromAddress, toAddress, amount, asset, memo = "", sequence = null) {
    const accCode = crypto.decodeAddress(fromAddress)
    const toAccCode = crypto.decodeAddress(toAddress)

    amount = new Big(amount)
    amount = Number(amount.mul(BASENUMBER).toString())

    checkNumber(amount, "amount")

    const coin = {
      denom: asset,
      amount: amount,
    }

    const msg = {
      inputs: [{
        address: accCode,
        coins: [coin]
      }],
      outputs: [{
        address: toAccCode,
        coins: [coin]
      }],
      msgType: "MsgSend"
    }

    const msgs = [{
      type: "cosmos-sdk/MsgSend",
      value: {
        amount: [coin],
        from_address: accCode,
        to_address: toAccCode
      }
    }];

    const signMsg = {
      inputs: [{
        address: fromAddress,
        coins: [{
          amount: amount,
          denom: asset
        }]
      }],
      outputs: [{
        address: toAddress,
        coins: [{
          amount: amount,
          denom: asset
        }]
      }]
    }

    const signedTx = await this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo)
    return this._broadcastDelegate(signedTx)
  }

  /**
   * Prepare a serialized raw transaction for sending to the blockchain.
   * @param {Object} msg the msg object
   * @param {Object} stdSignMsg the sign doc object used to generate a signature
   * @param {String} address
   * @param {Number} sequence optional sequence
   * @param {String} memo optional memo
   * @return {Transaction} signed transaction
   */
  async _prepareTransaction(msg, stdSignMsg, address, sequence = null, memo = "") {
    if ((!this.account_number || (sequence !== 0 && !sequence)) && address) {
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      sequence = data.result.sequence
      this.account_number = data.result.account_number
      // if user has not used `await` in its call to setPrivateKey (old API), we should wait for the promise here
    } else if (this._setPkPromise) {
      await this._setPkPromise
    }

    const options = {
      account_number: parseInt(this.account_number),
      chain_id: this.chainId,
      memo: memo,
      msg,
      sequence: parseInt(sequence),
      source: this._source,
      type: msg.msgType,
    }

    const tx = new Transaction(options)
    return this._signingDelegate.call(this, tx, stdSignMsg)
  }

}
