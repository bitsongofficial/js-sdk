"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _coin = require("./coin");

Object.keys(_coin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _coin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _coin[key];
    }
  });
});

var _fee = require("./fee");

Object.keys(_fee).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _fee[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fee[key];
    }
  });
});