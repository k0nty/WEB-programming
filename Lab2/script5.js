function Painter(color) {
    return function(obj) {
        if (obj && obj.type) {
            console.log(`${color} ${obj.type}`);
        } else {
            console.log("No 'type' property occurred!");
        }
    };
}

let PaintBlue = Painter("Blue");
let PaintRed = Painter("Red");
let PaintYellow = Painter("Yellow");

let object1 = {
    maxSpeed: 280,
    type: "Sportcar",
    color: "magenta"
};

let object2 = {
    type: "Truck",
    avgSpeed: 90,
    loadCapacity: 2400
};

let object3 = {
    maxSpeed: 180,
    color: "purple",
    isCar: true
};

console.log("Результати Object 1:");
PaintBlue(object1);
PaintRed(object1);
PaintYellow(object1);

console.log("\nРезультати Object 2:");
PaintBlue(object2);
PaintRed(object2);
PaintYellow(object2);

console.log("\nРезультати Object 3:");
PaintBlue(object3);
PaintRed(object3);
PaintYellow(object3);