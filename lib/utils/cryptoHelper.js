"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sha3 = exports.sha256 = exports.sha256ripemd160 = exports.ab2hexstring = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _encHex = _interopRequireDefault(require("crypto-js/enc-hex"));

var _ripemd = _interopRequireDefault(require("crypto-js/ripemd160"));

var _sha = _interopRequireDefault(require("crypto-js/sha256"));

var _sha2 = _interopRequireDefault(require("crypto-js/sha3"));

/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
var ab2hexstring = function ab2hexstring(arr) {
  if ((0, _typeof2["default"])(arr) !== "object") {
    throw new Error("ab2hexstring expects an array");
  }

  var result = "";

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toString(16);
    str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
    result += str;
  }

  return result;
};
/**
 * Computes a SHA256 followed by a RIPEMD160.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */


exports.ab2hexstring = ab2hexstring;

var sha256ripemd160 = function sha256ripemd160(hex) {
  if (typeof hex !== "string") throw new Error("sha256ripemd160 expects a string");
  if (hex.length % 2 !== 0) throw new Error("invalid hex string length: ".concat(hex));

  var hexEncoded = _encHex["default"].parse(hex);

  var ProgramSha256 = (0, _sha["default"])(hexEncoded);
  return (0, _ripemd["default"])(ProgramSha256).toString();
};
/**
 * Computes a single SHA256 digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */


exports.sha256ripemd160 = sha256ripemd160;

var sha256 = function sha256(hex) {
  if (typeof hex !== "string") throw new Error("sha256 expects a hex string");
  if (hex.length % 2 !== 0) throw new Error("invalid hex string length: ".concat(hex));

  var hexEncoded = _encHex["default"].parse(hex);

  return (0, _sha["default"])(hexEncoded).toString();
};
/**
 * Computes a single SHA3 (Keccak) digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */


exports.sha256 = sha256;

var sha3 = function sha3(hex) {
  if (typeof hex !== "string") throw new Error("sha3 expects a hex string");
  if (hex.length % 2 !== 0) throw new Error("invalid hex string length: ".concat(hex));

  var hexEncoded = _encHex["default"].parse(hex);

  return (0, _sha2["default"])(hexEncoded).toString();
};

exports.sha3 = sha3;