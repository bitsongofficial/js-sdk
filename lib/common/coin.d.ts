export declare class Coin {
    amount: string;
    denom: string;
    static parse(str: string): Coin;
    constructor(amount: string, denom: string);
    toString(): string;
}
