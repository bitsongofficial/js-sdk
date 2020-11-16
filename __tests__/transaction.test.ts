import Transaction, { Msg } from "../src/tx"

import { privateKey, targetAddress, defaultFee } from "./utils"

describe("Transaction", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("should sign MsgSend", async () => {
    const chain_id = "test-chain"
    const account_number = "0"
    const sequence = "0"

    const msg: Msg = {
      type: "cosmos-sdk/MsgSend",
      value: {
        amount: [
          {
            amount: "1000000",
            denom: "ubtsg",
          },
        ],
        from_address: targetAddress,
        to_address: targetAddress,
      },
    }

    const tx: Transaction = new Transaction(
      chain_id,
      account_number,
      sequence,
      defaultFee,
      "",
      [msg]
    )
    tx.setMode("block")

    const txBz = tx.sign(privateKey).serialize()
    expect(txBz).toBe(
      '{"mode":"block","tx":{"fee":{"amount":[{"amount":"50000","denom":"ubtsg"}],"gas":"200000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000000","denom":"ubtsg"}],"from_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag","to_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag"}}],"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AzblYSd9LidsFp/2Kkz8da6kXNwWCAROOiTZY8VefuUT"},"signature":"RvLYkA0wFAvkQnZgFo6ro0XwyWbLm+zLOdrNY8R/J/VsDmp8mQ7Ay3jylW+Wcaft1K+GUbMsnAQi2a/OuLPI0Q=="}]}}'
    )
  })

  it("should sign MsgDelegate", async () => {
    const chain_id = "test-chain"
    const account_number = "0"
    const sequence = "0"

    const msg: Msg = {
      type: "cosmos-sdk/MsgDelegate",
      value: {
        delegator_address: targetAddress,
        validator_address:
          "bitsongvaloper1pdfr7xuckj6lhdphdde6peres9ufwgps8v9w59",
        amount: {
          denom: "ubtsg",
          amount: "1000000",
        },
      },
    }

    const tx: Transaction = new Transaction(
      chain_id,
      account_number,
      sequence,
      defaultFee,
      "",
      [msg]
    )
    tx.setMode("block")

    const txBz = tx.sign(privateKey).serialize()
    expect(txBz).toBe(
      '{"mode":"block","tx":{"fee":{"amount":[{"amount":"50000","denom":"ubtsg"}],"gas":"200000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgDelegate","value":{"amount":{"amount":"1000000","denom":"ubtsg"},"delegator_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag","validator_address":"bitsongvaloper1pdfr7xuckj6lhdphdde6peres9ufwgps8v9w59"}}],"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AzblYSd9LidsFp/2Kkz8da6kXNwWCAROOiTZY8VefuUT"},"signature":"gU0Dn7ncVgxCIE7WNNJ+oULwvvAOm247xfZ34Bae7ZxjngssNqx2pSbt9SY2x/0b9TO4wy4CxVeG4BJTPiDbjw=="}]}}'
    )
  })
})
