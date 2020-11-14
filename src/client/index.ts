/* eslint-disable */
import * as crypto from "../crypto"
import HttpRequest from "../utils/request"
import { v4 as uuidv4 } from 'uuid';
import FileSaver from "file-saver"

/**
 * The Bitsong Network client.
 */
export class BitSongClient {

  public _httpClient: HttpRequest
  private _hdpath: string | string = `44'/118'/0'/0/`
  private _privateKey: string | null = null
  public address?: string
  public chainId?: string | null
  public addressPrefix: string | string = 'bitsong'

  /**
   * @param {String} server BitSong Network public url
   * @param {String} addressPrefix BitSong Address Prefix
   * @param {String} hdpath BitSong HDPATH
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  // constructor(server: string, useAsyncBroadcast = false, source = 0) {
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
  }

  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */
  async initChain() {
    if (!this.chainId) {
      const data = await this._httpClient.request("get", "node_info")
      this.chainId = data.result.node_info && data.result.node_info.network
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
}
