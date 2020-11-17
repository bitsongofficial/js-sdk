"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitSongClient = exports.api = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var crypto = _interopRequireWildcard(require("../crypto"));

var _request = _interopRequireDefault(require("../utils/request"));

var _uuid = require("uuid");

var _fileSaver = _interopRequireDefault(require("file-saver"));

var _tx = require("../tx");

/* eslint-disable */
var api = {
  broadcast: "/txs"
};
/**
 * The Bitsong Network client.
 */

exports.api = api;

var BitSongClient = /*#__PURE__*/function () {
  /**
   * @param {String} server BitSong Network public url
   * @param {String} addressPrefix BitSong Address Prefix
   * @param {String} hdpath BitSong HDPATH
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  function BitSongClient(server, addressPrefix, hdpath) {
    (0, _classCallCheck2["default"])(this, BitSongClient);
    (0, _defineProperty2["default"])(this, "_httpClient", void 0);
    (0, _defineProperty2["default"])(this, "_hdpath", "44'/118'/0'/0/");
    (0, _defineProperty2["default"])(this, "_privateKey", void 0);
    (0, _defineProperty2["default"])(this, "address", void 0);
    (0, _defineProperty2["default"])(this, "chain_id", void 0);
    (0, _defineProperty2["default"])(this, "addressPrefix", 'bitsong');
    (0, _defineProperty2["default"])(this, "account_number", void 0);
    (0, _defineProperty2["default"])(this, "mode", void 0);

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

    this.chain_id = "";
    this._privateKey = "";
    this.account_number = "";
    this.mode = "sync";
  }
  /**
   * Set broadcast mode
   * @param {string} mode
   * @return {void}
   */


  (0, _createClass2["default"])(BitSongClient, [{
    key: "setMode",
    value: function setMode(mode) {
      this.mode = mode;
    }
    /**
     * Set client account.
     * @param {string} privateKey
     * @return {BitSongClient}
     */

  }, {
    key: "setAccountInfo",
    value: function () {
      var _setAccountInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(privateKey) {
        var address, account;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(privateKey !== this._privateKey)) {
                  _context.next = 14;
                  break;
                }

                address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);

                if (address) {
                  _context.next = 4;
                  break;
                }

                throw new Error("invalid privateKey: " + privateKey);

              case 4:
                if (!(address === this.address)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", this);

              case 6:
                this._privateKey = privateKey;
                this.address = address;
                _context.next = 10;
                return this.getAccount(address);

              case 10:
                account = _context.sent;
                _context.next = 13;
                return this.getAccountNumberFromAccountInfo(account);

              case 13:
                this.account_number = _context.sent;

              case 14:
                return _context.abrupt("return", this);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setAccountInfo(_x) {
        return _setAccountInfo.apply(this, arguments);
      }

      return setAccountInfo;
    }()
    /**
     * Build Transaction before broadcast.
     * @param {Object} msg
     * @param {Object} signMsg
     * @param {String} memo
     * @param {String} fee
     * @param {Number} sequenceNumber
     * @return {Transaction} Transaction object
     */

  }, {
    key: "buildTransaction",
    value: function () {
      var _buildTransaction = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(msgs) {
        var memo,
            fee,
            sequence_number,
            account_info,
            tx,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                memo = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "";
                fee = _args2.length > 2 ? _args2[2] : undefined;
                sequence_number = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : "";

                if (!(!this.account_number || !sequence_number)) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 6;
                return this.getAccount();

              case 6:
                account_info = _context2.sent;
                sequence_number = this.getSequenceNumberFromAccountInfo(account_info);
                this.account_number = this.getAccountNumberFromAccountInfo(account_info);

              case 9:
                tx = new _tx.Transaction(this.chain_id, this.account_number, sequence_number, fee, memo, msgs);
                tx.setMode(this.mode);
                return _context2.abrupt("return", tx.sign(this._privateKey).serialize());

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function buildTransaction(_x2) {
        return _buildTransaction.apply(this, arguments);
      }

      return buildTransaction;
    }()
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {String} signedBz signed and serialized raw transaction
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "broadcast",
    value: function () {
      var _broadcast = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(signedBz) {
        var opts, response;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                opts = {
                  data: signedBz,
                  headers: {
                    "content-type": "text/plain"
                  }
                };
                _context3.next = 3;
                return this._httpClient.request("post", "".concat(api.broadcast), null, opts);

              case 3:
                response = _context3.sent;
                return _context3.abrupt("return", response);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function broadcast(_x3) {
        return _broadcast.apply(this, arguments);
      }

      return broadcast;
    }()
    /**
     * Initialize the client with the chain's ID. Asynchronous.
     * @return {Promise}
     */

  }, {
    key: "initChain",
    value: function () {
      var _initChain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var data;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.chain_id) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 3;
                return this._httpClient.request("get", "node_info");

              case 3:
                data = _context4.sent;
                this.chain_id = data.result.node_info && data.result.node_info.network;

              case 5:
                return _context4.abrupt("return", this);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
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
      var _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var address,
            data,
            _args5 = arguments;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                address = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : this.address;

                if (address) {
                  _context5.next = 3;
                  break;
                }

                throw new Error("address should not be empty");

              case 3:
                _context5.prev = 3;
                _context5.next = 6;
                return this._httpClient.request("get", "auth/accounts/".concat(address));

              case 6:
                data = _context5.sent;
                return _context5.abrupt("return", data);

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](3);
                return _context5.abrupt("return", null);

              case 13:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 10]]);
      }));

      function getAccount() {
        return _getAccount.apply(this, arguments);
      }

      return getAccount;
    }()
    /**
     * get SequenceNumber from accountInfo Object
     * @param {String} accountInfo
     * @return {Number} sequenceNumber
     */

  }, {
    key: "getSequenceNumberFromAccountInfo",
    value: function getSequenceNumberFromAccountInfo(accountInfo) {
      return accountInfo.result.result.value.sequence;
    }
    /**
     * get accountNumber from accountInfo Object
     * @param {String} accountInfo
     * @return {Number} accountNumber
     */

  }, {
    key: "getAccountNumberFromAccountInfo",
    value: function getAccountNumberFromAccountInfo(accountInfo) {
      return accountInfo.result.result.value.account_number;
    }
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
    /**
     * Build and broadcast MsgSend
     * @param {String} to_address
     * @param {Coin} amount
     * @return {Promise}
     */

  }, {
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(to_address, amount) {
        var memo,
            fee,
            sequence,
            msg,
            account,
            signedTx,
            _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                memo = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : "";
                fee = _args6.length > 3 ? _args6[3] : undefined;
                sequence = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : "";
                msg = {
                  type: "cosmos-sdk/MsgSend",
                  value: {
                    amount: amount,
                    from_address: this.address,
                    to_address: to_address
                  }
                };

                if (!(sequence === "")) {
                  _context6.next = 9;
                  break;
                }

                _context6.next = 7;
                return this.getAccount(this.address);

              case 7:
                account = _context6.sent;
                sequence = this.getSequenceNumberFromAccountInfo(account);

              case 9:
                _context6.next = 11;
                return this.buildTransaction([msg], memo, fee);

              case 11:
                signedTx = _context6.sent;
                return _context6.abrupt("return", this.broadcast(signedTx));

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function send(_x4, _x5) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
    /**
     * Build and broadcast MsgDelegate
     * @param {String} to_address
     * @param {Coin} amount
     * @return {Promise}
     */

  }, {
    key: "delegate",
    value: function () {
      var _delegate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(validator_address, amount) {
        var memo,
            fee,
            sequence,
            msg,
            account,
            signedTx,
            _args7 = arguments;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                memo = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "";
                fee = _args7.length > 3 ? _args7[3] : undefined;
                sequence = _args7.length > 4 && _args7[4] !== undefined ? _args7[4] : "";
                msg = {
                  type: "cosmos-sdk/MsgDelegate",
                  value: {
                    delegator_address: this.address,
                    validator_address: validator_address,
                    amount: amount
                  }
                };

                if (!(sequence === "")) {
                  _context7.next = 9;
                  break;
                }

                _context7.next = 7;
                return this.getAccount(this.address);

              case 7:
                account = _context7.sent;
                sequence = this.getSequenceNumberFromAccountInfo(account);

              case 9:
                _context7.next = 11;
                return this.buildTransaction([msg], memo, fee);

              case 11:
                signedTx = _context7.sent;
                return _context7.abrupt("return", this.broadcast(signedTx));

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function delegate(_x6, _x7) {
        return _delegate.apply(this, arguments);
      }

      return delegate;
    }()
  }]);
  return BitSongClient;
}();

exports.BitSongClient = BitSongClient;