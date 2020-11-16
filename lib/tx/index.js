"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var crypto = _interopRequireWildcard(require("../crypto"));

var _utils = require("../utils");

/**
 * Transaction
 * @param {String} param.account_number
 * @param {String} param.chain_id
 * @param {Object} param.fee
 * @param {String} param.memo
 * @param {Object} param.msg
 * @param {String} param.sequence
 */
var Transaction = /*#__PURE__*/function () {
  function Transaction(chain_id, account_number, sequence, fee) {
    var memo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var msgs = arguments.length > 5 ? arguments[5] : undefined;
    var signatures = arguments.length > 6 ? arguments[6] : undefined;
    (0, _classCallCheck2["default"])(this, Transaction);
    (0, _defineProperty2["default"])(this, "chain_id", void 0);
    (0, _defineProperty2["default"])(this, "account_number", void 0);
    (0, _defineProperty2["default"])(this, "sequence", void 0);
    (0, _defineProperty2["default"])(this, "fee", void 0);
    (0, _defineProperty2["default"])(this, "msgs", void 0);
    (0, _defineProperty2["default"])(this, "memo", void 0);
    (0, _defineProperty2["default"])(this, "signatures", void 0);
    (0, _defineProperty2["default"])(this, "mode", void 0);
    this.chain_id = chain_id;
    this.sequence = sequence;
    this.account_number = account_number;
    this.fee = fee;
    this.msgs = msgs;
    this.memo = memo;
    this.signatures = signatures;
    this.mode = "sync";
  }

  (0, _createClass2["default"])(Transaction, [{
    key: "setMode",
    value: function setMode(mode) {
      this.mode = mode;
    }
  }, {
    key: "getSignBytes",
    value: function getSignBytes() {
      var signMsg = {
        account_number: this.account_number,
        chain_id: this.chain_id,
        fee: this.fee,
        memo: this.memo,
        msgs: this.msgs,
        sequence: this.sequence
      };
      return (0, _utils.convertObjectToSignBytes)((0, _utils.sortObject)(signMsg));
    }
  }, {
    key: "sign",
    value: function sign(privateKey) {
      if (!privateKey) {
        throw new Error("private key should not be null");
      }

      var signBytes = this.getSignBytes();
      var privKeyBuf = Buffer.from(privateKey, "hex");
      var signature = crypto.generateSignature(signBytes.toString("hex"), privKeyBuf);
      var pubKey = crypto.encodePubKeyToCompressedBuffer(crypto.generatePubKey(privKeyBuf));
      this.signatures = [{
        pub_key: {
          type: "tendermint/PubKeySecp256k1",
          value: pubKey
        },
        signature: signature
      }];
      return this;
    }
  }, {
    key: "serialize",
    value: function serialize() {
      if (!this.signatures) {
        throw new Error("signature is null");
      }

      var serializedTx = {
        mode: this.mode,
        tx: {
          fee: this.fee,
          memo: this.memo,
          msg: this.msgs,
          signatures: this.signatures.map(function (sig) {
            sig.pub_key.value = sig.pub_key.value.toString("base64");
            sig.signature = sig.signature.toString("base64");
            return sig;
          })
        }
      };
      return JSON.stringify((0, _utils.sortObject)(serializedTx));
    }
  }]);
  return Transaction;
}();

var _default = Transaction;
exports["default"] = _default;