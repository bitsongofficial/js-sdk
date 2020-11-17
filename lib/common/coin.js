"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Coin = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

// Some concepts are based from
// https://github.com/chainapsis/cosmosjs/blob/master/src/common/coin.ts
var Coin = /*#__PURE__*/function () {
  (0, _createClass2["default"])(Coin, null, [{
    key: "parse",
    value: function parse(str) {
      var re = new RegExp("([0-9]+)[ ]*([a-zA-Z]+)");
      var execed = re.exec(str);

      if (!execed || execed.length !== 3) {
        throw new Error("Invalid coin string");
      }

      var amount = execed[1];
      var denom = execed[2];
      return new Coin(amount, denom);
    }
  }]);

  function Coin(amount, denom) {
    (0, _classCallCheck2["default"])(this, Coin);
    (0, _defineProperty2["default"])(this, "amount", void 0);
    (0, _defineProperty2["default"])(this, "denom", void 0);
    this.amount = amount;
    this.denom = denom;
  }

  (0, _createClass2["default"])(Coin, [{
    key: "toString",
    value: function toString() {
      return this.amount + this.denom;
    }
  }]);
  return Coin;
}();

exports.Coin = Coin;