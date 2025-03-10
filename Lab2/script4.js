function PiMultiplier(multiplier) {
    return function() {
        return Math.PI * multiplier;
    };
}

let doublePi = PiMultiplier(2);
let twoThreePi = PiMultiplier(2/3);
let halfPi = PiMultiplier(1/2);

console.log("pi * 2 = ", doublePi());
console.log("pi * 2/3 = ", twoThreePi());
console.log("pi / 2 = ", halfPi());