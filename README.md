# BitSong Network JavaScript SDK

<p>
<img src="https://img.shields.io/badge/version-0.4.0--dev-yellow.svg" />
<a href="https://twitter.com/bitsongofficial">
<img alt="Twitter: BitSong" src="https://img.shields.io/twitter/follow/bitsongofficial.svg?style=social"  target="_blank" />
</a>
</p>

The BitSong Network JavaScript SDK allows browsers and node.js clients to
interact with BitSong Network. It includes the following core components:

- **crypto** - core cryptographic functions.
- **client** - implementations of BitSong Network transaction types, such as for
  transfer and staking.
- **accounts** - management of "accounts" and wallets, including seed and
  encrypted mnemonic generation.

## THIS PROJECT IS UNDER ACTIVE DEVELOPMENT

> Most concepts are based from binance-javascript-sdk
> https://github.com/binance-chain/javascript-sdk

## Projects Availables

- [BitSong Console](https://console.bitsong.network)

# Installation

Important, please follow the instructions for your OS below:

**Windows users:** Please install
[windows-build-tools](https://www.npmjs.com/package/windows-build-tools) first.

**Mac users:** Make sure XCode Command Line Tools are installed:
`xcode-select --install`.

**Linux users:** Note that Ubuntu Xenial and newer distributions are
recommended, especially when using Travis or other CI systems. You may need some
dev packages to be installed on your system for USB support. On Debian-based
distributions (like Ubuntu) you should install them with this command:

```bash
$ sudo apt-get install libudev-dev libusb-dev usbutils
```

### Install the NPM package

If you **do not** need Ledger support with node.js:

```bash
$ npm i -s https://github.com/bitsongofficial/js-sdk.git#v0.5.0-dev --no-optional
```

If you **need** Ledger support with node.js:

```bash
$ npm i -s https://github.com/bitsongofficial/js-sdk.git#v0.5.0-dev
```

### Use with Webpack

We often see Webpack builds failing with the SDK due to the `usb` dependency,
but adding this to your Webpack config should fix that:

```js
module.exports = {
  plugins: [new webpack.IgnorePlugin(/^usb$/)],
}
```

or

```js
config.plugins.push(new webpack.IgnorePlugin(/^usb$/))
```

## How to use

More examples will be provided soon.

```js
const BitSongClient = require("@bitsongofficial/js-sdk").BitSongClient
const Coin = require("@bitsongofficial/js-sdk").Coin
const Fee = require("@bitsongofficial/js-sdk").Fee

;(async () => {
  const bitsong = new BitSongClient("https://lcd.testnet4.bitsong.network")
  await bitsong.initChain()
  bitsong.setMode("block") // optional: set broadcast mode to block instead of sync

  // const alice = await bitsong.recoverAccountFromMnemonic("alice----mnemonic")
  const alice = await bitsong.createAccountWithMneomnic()
  console.log(alice)

  // const jack = await bitsong.recoverAccountFromMnemonic("jack----mnemonic")
  const jack = await bitsong.createAccountWithMneomnic()
  console.log(jack)

  // Set your private key and retrieve your account info
  try {
    await bitsong.setAccountInfo(alice.privateKey)
  } catch (e) {
    console.error(e)
  }

  // Transfer 1000000ubtsg from alice to jack
  try {
    const amount = [Coin.parse("1000000ubtsg")]
    const fee = new Fee([Coin.parse("50000ubtsg")], "200000")
    const memo = "Sent from bitsong js-sdk ;)"

    const response = await bitsong.send(jack.address, amount, memo, fee)
    console.log(response)
  } catch (e) {
    console.error(e)
  }

  // Delegate 1000000ubtsg from alice to bitsongvaloper1ttsse04t2n9z4llnmrdjh9lrq45tp829evxmy4
  try {
    const validator = "bitsongvaloper1ttsse04t2n9z4llnmrdjh9lrq45tp829evxmy4"
    const amount = Coin.parse("1000000ubtsg")
    const fee = new Fee([Coin.parse("50000ubtsg")], "200000")
    const memo = "Delegated from bitsong js-sdk ;)"

    const response = await bitsong.delegate(validator, amount, memo, fee)
    console.log(response)
  } catch (e) {
    console.error(e)
  }
})()
```

# Testing

All new code changes should be covered with unit tests. You can run the tests
with the following command:

```bash
$ npm run test
```

Tests for the Ledger hardware wallet integration have their own suite that runs
in both node and in the browser:

```bash
$ npm run test:ledger
$ npm run test:ledger:browser
```

# Contributing

Contributions to the BitSong Network JavaScript SDK are welcome. Please ensure
that you have tested the changes with a local client and have added unit test
coverage for your code.
