"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BitSongClient", {
  enumerable: true,
  get: function get() {
    return _client.BitSongClient;
  }
});
exports.crypto = void 0;

require("./declarations");

var _client = require("./client");

var crypto = _interopRequireWildcard(require("./crypto"));

exports.crypto = crypto;