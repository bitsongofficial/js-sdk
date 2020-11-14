import Big, { BigSource } from "big.js"

import * as crypto from "../src/crypto"

import { getClient, mnemonic, keystore, targetAddress, wait } from "./utils"

const waitSeconds = 0

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

it("get account", async () => {
  await wait(waitSeconds)
  const client = await getClient(false)
  const res = await client.getAccount(targetAddress)
  if (res.status === 200) {
    expect(res.status).toBe(200)
  } else {
    expect(res.status).toBe(204)
  }
})
