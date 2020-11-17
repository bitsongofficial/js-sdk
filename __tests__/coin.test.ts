import { Coin } from "../src/common/coin"

describe("coin", () => {
  it("parse coin", () => {
    const coinStr = "1000ubtsg"
    const coin = Coin.parse(coinStr)
    expect(coin.toString()).toStrictEqual(coinStr)
  })
  it("create coin object", () => {
    const coinStr = "1000ubtsg"
    const coin = new Coin("1000", "ubtsg")
    expect(coin.toString()).toStrictEqual(coinStr)
  })
})
