import Big, { BigSource } from "big.js"

import { BitSongClient } from "../src/client"
import * as crypto from "../src/crypto"

export const mnemonic =
  "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

const keystore = {
  version: 1,
  id: "51c8f456-0922-42a5-9167-ae7f06b78f94",
  crypto: {
    ciphertext:
      "1b203c4ac9c14a1c4c1404f3c70004af466ce0e9a93886f273e11f15fd74a9ea",
    cipherparams: {
      iv: "c45a39c136ecdc26bc92b51aac44a600",
    },
    cipher: "aes-256-ctr",
    kdf: "pbkdf2",
    kdfparams: {
      dklen: 32,
      salt: "f19fa2c0f9f753386d2a850be908e55fc7974ba284a4b3b0b90ad55d213c7783",
      c: 262144,
      prf: "hmac-sha256",
    },
    mac:
      "20361f6d0e6c5321617a6f647c85b1c356a0cb79e560322f00d758d90d5f3a27a2555530fb7315d8209e61fd2d4a85490e349a871d67aac8a79441fa903691ce",
  },
}

let client: BitSongClient

export const getClient = async (
  useAwaitSetPrivateKey = true,
  doNotSetPrivateKey = false,
  url = "https://rpc.testnet-3.bitsong.network"
) => {
  if (client && client.chainId) {
    return client
  }

  client = new BitSongClient(url)
  // await client.initChain()
  // const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
  // if (!doNotSetPrivateKey) {
  //   if (useAwaitSetPrivateKey) {
  //     await client.setPrivateKey(privateKey)
  //   } else {
  //     client.setPrivateKey(privateKey) // test without `await`
  //   }
  // }

  // // use default delegates (signing, broadcast)
  // client.useDefaultSigningDelegate()
  // client.useDefaultBroadcastDelegate()
  return client
}

export const wait = (ms) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}

export const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
export const address = crypto.getAddressFromPrivateKey(privateKey)

const MAX_INT64 = Math.pow(2, 63)

/**
 * validate the input number.
 * @param {Number} value
 */
export const checkNumber = (value: BigSource, name = "input number") => {
  if (new Big(value).lte(0)) {
    throw new Error(`${name} should be a positive number`)
  }

  if (new Big(value).gte(MAX_INT64)) {
    throw new Error(`${name} should be less than 2^63`)
  }
}

beforeEach(() => {
  jest.setTimeout(10000)
})

it("ensures that the number is positive", async () => {
  expect(() => checkNumber(-100, "-100")).toThrowError(
    "-100 should be a positive number"
  )
})

it("ensures that the number is less than 2^63", async () => {
  expect(() => checkNumber(Math.pow(2, 63), "2^63")).toThrowError(
    "2^63 should be less than 2^63"
  )
  expect(() => checkNumber(Math.pow(2, 63) + 1, "2^63")).toThrowError(
    "2^63 should be less than 2^63"
  )
})

it("create account", async () => {
  const client = await getClient(false)
  const res = client.createAccount()
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("create account with keystore", async () => {
  const client = await getClient(false, true)
  const res = client.createAccountWithKeystore("12345678")
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
  expect(res.keystore).toBeTruthy()
})

it("recover account from keystore", async () => {
  const client = await getClient(false, true)
  const res = client.recoverAccountFromKeystore(keystore, "12345678")
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("recover account from bad password keystore", async () => {
  const client = await getClient(false, true)
  expect(() => {
    client.recoverAccountFromKeystore(keystore, "12345qwert!S")
  }).toThrowError()
})

it("recover account from mneomnic", async () => {
  jest.setTimeout(50000)
  const client = await getClient(false)
  const res = client.recoverAccountFromMneomnic(mnemonic)
  await 1500
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("recover account from privatekey", async () => {
  jest.setTimeout(50000)
  const client = await getClient(false)
  const pk = crypto.generatePrivateKey()
  const res = client.recoverAccountFromPrivateKey(pk)
  await 1500
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})
