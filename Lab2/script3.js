function Triangular({ a = 3, b = 4, c = 5 } = {}) {
    return {
        a,
        b,
        c
    };
}

const triangle1 = Triangular();
console.log("Трикутник 1 (за замовчуванням):", triangle1);

const triangle2 = Triangular({ a: 5, b: 12, c: 13 });
console.log("Трикутник 2:", triangle2);

const triangle3 = Triangular({ a: 7, b: 24, c: 25 });
console.log("Трикутник 3:", triangle3);