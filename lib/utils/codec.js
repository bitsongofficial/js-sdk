"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertObjectToSignBytes = exports.sortObject = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var sortObject = function sortObject(obj) {
  if (obj === null) return null;
  if ((0, _typeof2["default"])(obj) !== "object") return obj; // arrays have typeof "object" in js!

  if (Array.isArray(obj)) return obj.map(sortObject);
  var sortedKeys = Object.keys(obj).sort();
  var result = {};
  sortedKeys.forEach(function (key) {
    result[key] = sortObject(obj[key]);
  });
  return result;
};

exports.sortObject = sortObject;

var convertObjectToSignBytes = function convertObjectToSignBytes(obj) {
  return Buffer.from(JSON.stringify(sortObject(obj)));
};

exports.convertObjectToSignBytes = convertObjectToSignBytes;