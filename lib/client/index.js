"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitSongClient = exports.NETWORK_PREFIX_MAPPING = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var crypto = _interopRequireWildcard(require("../crypto"));

/* eslint-disable */
var NETWORK_PREFIX_MAPPING = {
  testnet: "bitsong",
  mainnet: "bitsong"
};
/**
 * The Bitsong Network client.
 */

exports.NETWORK_PREFIX_MAPPING = NETWORK_PREFIX_MAPPING;

var BitSongClient = /*#__PURE__*/function () {
  /**
   * @param {String} server BitSong Network public url
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  // constructor(server: string, useAsyncBroadcast = false, source = 0) {
  function BitSongClient(server) {
    (0, _classCallCheck2["default"])(this, BitSongClient);
    (0, _defineProperty2["default"])(this, "addressPrefix", "bitsong");
    (0, _defineProperty2["default"])(this, "address", void 0);
    (0, _defineProperty2["default"])(this, "_privateKey", null);

    if (!server) {
      throw new Error("BitSong chain server should not be null");
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


  (0, _createClass2["default"])(BitSongClient, [{
    key: "createAccount",
    value: function createAccount() {
      var privateKey = crypto.generatePrivateKey();
      return {
        privateKey: privateKey,
        address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)
      };
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

  }, {
    key: "createAccountWithKeystore",
    value: function createAccountWithKeystore(password) {
      if (!password) {
        throw new Error("password should not be falsy");
      }

      var privateKey = crypto.generatePrivateKey();
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      var keystore = crypto.generateKeyStore(privateKey, password);
      return {
        privateKey: privateKey,
        address: address,
        keystore: keystore
      };
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

  }, {
    key: "createAccountWithMneomnic",
    value: function createAccountWithMneomnic() {
      var mnemonic = crypto.generateMnemonic();
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address,
        mnemonic: mnemonic
      };
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

  }, {
    key: "recoverAccountFromKeystore",
    value: function recoverAccountFromKeystore(keystore, password) {
      var privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }
    /**
     * Recovers an account from a mnemonic seed phrase.
     * @param {string} mneomnic
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromMnemonic",
    value: function recoverAccountFromMnemonic(mnemonic) {
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    } // support an old method name containing a typo

  }, {
    key: "recoverAccountFromMneomnic",
    value: function recoverAccountFromMneomnic(mnemonic) {
      return this.recoverAccountFromMnemonic(mnemonic);
    }
    /**
     * Recovers an account using private key.
     * @param {String} privateKey
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromPrivateKey",
    value: function recoverAccountFromPrivateKey(privateKey) {
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }
    /**
     * Validates an address.
     * @param {String} address
     * @param {String} prefix
     * @return {Boolean}
     */

  }, {
    key: "checkAddress",
    value: function checkAddress(address) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.addressPrefix;
      return crypto.checkAddress(address, prefix);
    }
    /**
     * Returns the address for the current account if setPrivateKey has been called on this client.
     * @return {String}
     */

  }, {
    key: "getClientKeyAddress",
    value: function getClientKeyAddress() {
      if (!this._privateKey) throw new Error("no private key is set on this client");
      var address = crypto.getAddressFromPrivateKey(this._privateKey, this.addressPrefix);
      this.address = address;
      return address;
    }
  }]);
  return BitSongClient;
}();

exports.BitSongClient = BitSongClient;