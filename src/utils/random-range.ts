export function RandomRange(minRange :number, maxRange : number): number {
    let min = Math.ceil(minRange);
    let max = Math.floor(maxRange);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}