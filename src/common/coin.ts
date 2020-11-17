// Some concepts are based from
// https://github.com/chainapsis/cosmosjs/blob/master/src/common/coin.ts

export class Coin {
  public amount: string
  public denom: string

  public static parse(str: string): Coin {
    const re = new RegExp("([0-9]+)[ ]*([a-zA-Z]+)")
    const execed = re.exec(str)
    if (!execed || execed.length !== 3) {
      throw new Error("Invalid coin string")
    }
    const amount = execed[1]
    const denom = execed[2]
    return new Coin(amount, denom)
  }

  constructor(amount: string, denom: string) {
    this.amount = amount
    this.denom = denom
  }

  public toString(): string {
    return this.amount + this.denom
  }
}
