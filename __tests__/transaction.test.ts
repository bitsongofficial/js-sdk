import Transaction, { Fee, Msg } from "../src/tx"

import { privateKey, getClient, targetAddress, defaultFee } from "./utils"

describe("Transaction", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("should sign", () => {
    const msg: Msg = {
      type: "cosmos-sdk/MsgDelegate",
      value: {
        delegator_address: "bitsong1pdfr7xuckj6lhdphdde6peres9ufwgpsxge8yc",
        validator_address:
          "bitsongvaloper1pdfr7xuckj6lhdphdde6peres9ufwgps8v9w59",
        amount: {
          denom: "ubtsg",
          amount: "126709519",
        },
      },
    }

    const tx = new Transaction("bitsong-local", "1", "0", defaultFee, "", [msg])
    const txBz = tx.sign(privateKey).serialize()
    expect(txBz).toBe(
      '{"mode":"sync","tx":{"fee":{"amount":[{"amount":"50000","denom":"ubtsg"}],"gas":"200000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgDelegate","value":{"amount":{"amount":"126709519","denom":"ubtsg"},"delegator_address":"bitsong1pdfr7xuckj6lhdphdde6peres9ufwgpsxge8yc","validator_address":"bitsongvaloper1pdfr7xuckj6lhdphdde6peres9ufwgps8v9w59"}}],"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AzblYSd9LidsFp/2Kkz8da6kXNwWCAROOiTZY8VefuUT"},"signature":"aBbNPv9qfeivIkSZ3ewUWICt3gRLLpl1R4XREPlYNRkd/rx1XvJycIqYCUB7p2PTre6wBbPjDtpqw46qGc0mjQ=="}]}}'
    )
  })

  it("should transfer coins", async () => {
    const client = await getClient(true, false)
    const chain_id = client.chainId
    const account = await client.getAccount(targetAddress)
    const sequence = client.getSequenceNumberFromAccountInfo(account.result)
    const account_number = client.getAccountNumberFromAccountInfo(
      account.result
    )

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
    // expect(txBz).toBe(
    //   '{"mode":"block","tx":{"fee":{"amount":[{"amount":"50000","denom":"ubtsg"}],"gas":"200000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000000","denom":"ubtsg"}],"from_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag","to_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag"}}],"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AzblYSd9LidsFp/2Kkz8da6kXNwWCAROOiTZY8VefuUT"},"signature":"RexC2FSwcer4dnFb6fDNGr6/SoC56gv7NHf86ok5AJktMpcNiwgnqqBZvOr7KHEsca0UAHZvlhXuNRlr83blBA=="}]}}'
    // )
    const response = await client.broadcast(txBz)
    expect(response.result.logs.length).toBe(1)
  })

  it("should delegate coins", async () => {
    const client = await getClient(true, false)
    const chain_id = client.chainId
    const account = await client.getAccount(targetAddress)
    const sequence = client.getSequenceNumberFromAccountInfo(account.result)
    const account_number = client.getAccountNumberFromAccountInfo(
      account.result
    )

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
    // expect(txBz).toBe(
    //   '{"mode":"block","tx":{"fee":{"amount":[{"amount":"50000","denom":"ubtsg"}],"gas":"200000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000000","denom":"ubtsg"}],"from_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag","to_address":"bitsong1fmx9f072sv0e44lm3gstj7uvufll54kypum6ag"}}],"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AzblYSd9LidsFp/2Kkz8da6kXNwWCAROOiTZY8VefuUT"},"signature":"RexC2FSwcer4dnFb6fDNGr6/SoC56gv7NHf86ok5AJktMpcNiwgnqqBZvOr7KHEsca0UAHZvlhXuNRlr83blBA=="}]}}'
    // )
    const response = await client.broadcast(txBz)
    expect(response.result.logs.length).toBe(1)
  })
})
