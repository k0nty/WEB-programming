class Square {
    constructor(a) {
        this.a = a;
    }

    static help() {
        console.log("Квадрат - чотирикутник в якого рівні сторони та прямі кути");
        console.log("Особливості:");
        console.log("   Усі сторони мають однакову довжину");
        console.log("   Усі кути дорівнюють 90 градусів");
        console.log("   Периметр: 4 * довжина сторони");
        console.log("   Площа: довжина сторони * довжина сторони");
    }

    length() {
        return this.a * 4;
    }

    square() {
        return this.a * this.a;
    }

    info() {
        console.log("Характеристика квадрата:");
        console.log(`   Довжини всіх сторін: ${this.a}, ${this.a}, ${this.a}, ${this.a}`);
        console.log(`   Величини всіх кутів: 90, 90, 90, 90`);
        console.log(`   Сума довжин сторін: ${this.length()}`);
        console.log(`   Площа: ${this.square()}`);
    }
}

class Rectangle extends Square {
    constructor(a, b) {
        super(a);
        this.b = b;
    }

    static help() {
        console.log("Прямокутник - чотирикутник в якого протилежні сторони рівні та всі кути прямі");
        console.log("Особливості:");
        console.log("   Протилежні сторони рівні");
        console.log("   Усі кути дорівнюють 90 градусів");
        console.log("   Периметр: 2 * (a + b)");
        console.log("   Площа: a * b");
    }

    length() {
        return 2 * (this.a + this.b);
    }

    square() {
        return this.a * this.b;
    }

    info() {
        console.log("Характеристика прямокутника:");
        console.log(`   Довжини сторін: ${this.a}, ${this.b}, ${this.a}, ${this.b}`);
        console.log(`   Величини всіх кутів: 90, 90, 90, 90`);
        console.log(`   Сума довжин сторін: ${this.length()}`);
        console.log(`   Площа: ${this.square()}`);
    }
}

class Rhombus extends Square {
    constructor(a, alpha, beta) {
        super(a);
        this._alpha = alpha;
        this._beta = beta;
    }

    get a() {
        return this._a;
    }

    get alpha() {
        return this._alpha;
    }

    get beta() {
        return this._beta;
    }

    set a(value) {
        if (Number.isInteger(value) && value > 0) {
            this._a = value;
        } else {
            return "Сторона a має бути додатнім цілим числом";
        }
    }

    set alpha(value) {
        if (Number.isInteger(value) && value > 90 && value < 180) {
            this._alpha = value;
            this._beta = 180 - value;
        } else {
            return "Тупий кут alpha має бути цілим числом від 90 до 180";
        }
    }

    set beta(value) {
        if (Number.isInteger(value) && value > 0 && value < 90) {
            this.beta = value;
            this.alpha = 180 - value;
        } else {
            return "Гострий кут beta має бути цілим числом від 1 до 90";
        }
    }

    static help() {
        console.log("Ромб - чотирикутник в якого всі сторони рівні");
        console.log("Особливості:");
        console.log("   Усі сторони мають однакову довжину");
        console.log("   Протилежні кути рівні, сума сусідніх кутів 180 градусів");
        console.log("   Периметр: 4 * довжина сторони");
        console.log("   Площа: довжина сторони * довжина сторони * sin(гострий кут)");
    }

    length() {
        return this.a * 4;
    }

    square() {
        return this.a * this.a * Math.sin(this.beta * Math.PI / 180);
    }

    info() {
        console.log("Характеристика ромба:");
        console.log(`   Довжини всіх сторін: ${this.a}, ${this.a}, ${this.a}, ${this.a}`);
        console.log(`   Величини всіх кутів: ${this.alpha}, ${this.beta}, ${this.alpha}, ${this.beta}`);
        console.log(`   Сума довжин сторін: ${this.length()}`);
        console.log(`   Площа: ${this.square()}`);
    }
}

class Parallelogram extends Rectangle {
    constructor(a, b, alpha, beta) {
        super(a, b);
        this.alpha = alpha;
        this.beta = beta;
    }

    static help() {
        console.log("Паралелограм - чотирикутник в якого протилежні сторони рівні та паралельними");
        console.log("Особливості:");
        console.log("   Протилежні сторони рівні");
        console.log("   Протилежні кути рівні, сума сусідніх кутів 180 градусів");
        console.log("   Периметр: 2 * (a + b)");
        console.log("   Площа: a * b * sin(гострий кут)");
    }

    length() {
        return 2 * (this.a + this.b);
    }

    square() {
        return this.a * this.b * Math.sin(this.beta * Math.PI / 180);
    }

    info() {
        console.log("Характеристика паралелограма:");
        console.log(`   Довжини сторін: ${this.a}, ${this.b}, ${this.a}, ${this.b}`);
        console.log(`   Величини всіх кутів: ${this.alpha}, ${this.beta}, ${this.alpha}, ${this.beta}`);
        console.log(`   Сума довжин сторін: ${this.length()}`);
        console.log(`   Площа: ${this.square()}`);
    }
}

console.log("help для всіх класів");
Square.help();
console.log("\n");
Rectangle.help();
console.log("\n");
Rhombus.help();
console.log("\n");
Parallelogram.help();
console.log("\n");

console.log("об’єкти та їхні характеристики");
const squareObj = new Square(5);
const rectangleObj = new Rectangle(4, 6);
const rhombusObj = new Rhombus(3, 120, 60);
const parallelogramObj = new Parallelogram(4, 5, 135, 45);

console.log("Квадрат:");
squareObj.info();
console.log("\nПрямокутник:");
rectangleObj.info();
console.log("\nРомб:");
rhombusObj.info();
console.log("\nПаралелограм:");
parallelogramObj.info();

console.log("перевірка неттерів і сеттерів Rhombus");
console.log("Початкові значення:", rhombusObj.a, rhombusObj.alpha, rhombusObj.beta);
rhombusObj.a = 7;
rhombusObj.beta = 30;
console.log("Оновлені значення:", rhombusObj.a, rhombusObj.alpha, rhombusObj.beta);
rhombusObj.info();