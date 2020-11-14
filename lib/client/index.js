"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitSongClient = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var crypto = _interopRequireWildcard(require("../crypto"));

var _request = _interopRequireDefault(require("../utils/request"));

var _uuid = require("uuid");

var _fileSaver = _interopRequireDefault(require("file-saver"));

/* eslint-disable */

/**
 * The Bitsong Network client.
 */
var BitSongClient = /*#__PURE__*/function () {
  /**
   * @param {String} server BitSong Network public url
   * @param {String} addressPrefix BitSong Address Prefix
   * @param {String} hdpath BitSong HDPATH
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  // constructor(server: string, useAsyncBroadcast = false, source = 0) {
  function BitSongClient(server, addressPrefix, hdpath) {
    (0, _classCallCheck2["default"])(this, BitSongClient);
    (0, _defineProperty2["default"])(this, "_httpClient", void 0);
    (0, _defineProperty2["default"])(this, "_hdpath", "44'/118'/0'/0/");
    (0, _defineProperty2["default"])(this, "_privateKey", null);
    (0, _defineProperty2["default"])(this, "address", void 0);
    (0, _defineProperty2["default"])(this, "chainId", void 0);
    (0, _defineProperty2["default"])(this, "addressPrefix", 'bitsong');

    if (!server) {
      throw new Error("BitSong chain server should not be null");
    }

    this._httpClient = new _request["default"](server);

    if (addressPrefix) {
      this.addressPrefix = addressPrefix;
    }

    if (hdpath) {
      this._hdpath = hdpath;
    }
  }
  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */


  (0, _createClass2["default"])(BitSongClient, [{
    key: "initChain",
    value: function () {
      var _initChain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.chainId) {
                  _context.next = 5;
                  break;
                }

                _context.next = 3;
                return this._httpClient.request("get", "node_info");

              case 3:
                data = _context.sent;
                this.chainId = data.result.node_info && data.result.node_info.network;

              case 5:
                return _context.abrupt("return", this);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initChain() {
        return _initChain.apply(this, arguments);
      }

      return initChain;
    }()
    /**
     * get account
     * @param {String} address
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getAccount",
    value: function () {
      var _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var address,
            data,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                address = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : this.address;

                if (address) {
                  _context2.next = 3;
                  break;
                }

                throw new Error("address should not be empty");

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return this._httpClient.request("get", "auth/accounts/".concat(address));

              case 6:
                data = _context2.sent;
                return _context2.abrupt("return", data);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](3);
                return _context2.abrupt("return", null);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 10]]);
      }));

      function getAccount() {
        return _getAccount.apply(this, arguments);
      }

      return getAccount;
    }()
    /**
     * Creates a private key and returns it and its address.
     * @return {object} the private key and address in an object.
     * {
     *  address,
     *  privateKey
     * }
     */

  }, {
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
     * Generate and download an account keystore object, and returns the private key and address.
     * @param {String} privateKey
     * @param {String} password
     */

  }, {
    key: "generateAndDownloadKeyStore",
    value: function generateAndDownloadKeyStore(privateKey, password) {
      if (!privateKey) {
        throw new Error("password should not be falsy");
      }

      if (!password) {
        throw new Error("password should not be falsy");
      }

      var keystore = crypto.generateKeyStore(privateKey, password);
      var uuid = (0, _uuid.v4)();
      var blob = new Blob([JSON.stringify(keystore)], {
        type: "text/plain;charset=utf-8"
      });
      return _fileSaver["default"].saveAs(blob, "".concat(uuid, "_keystore.txt"));
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
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, this._hdpath);
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
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, this._hdpath);
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