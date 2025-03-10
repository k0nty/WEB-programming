let car1 = new Object();
car1.color = "yellow";
car1.maxSpeed = 225;
car1.tuning = true;
car1["number of accidents"] = 0;

car1.driver = new Object();
car1.driver.name = "Denys Prokopiuk"
car1.driver.category = "C";
car1.driver["personal limitations"] = "No driving at night";

car1.drive = function() {
    console.log("I am not driving at night");
};

console.log("car1:", car1);
car1.drive();

let car2 = {
    color: "white",
    maxSpeed: "120",
    tuning: false,
    "number of accidents": 2,
    driver: {
        name: "Denys Prokopiuk",
        category: "B",
        "personal limitations": null
    },
    drive: function() {
        console.log("I can drive anytime");
    }
}

console.log("car2:", car2);
car2.drive();

function Truck(color, weight, avgSpeed, brand, model) {
    this.color = color;
    this.weight = weight;
    this.avgSpeed = avgSpeed;
    this.brand = brand;
    this.model = model;
    this.trip = function() {
        if (!this.driver) {
            console.log("No driver assigned");
        } else {
            let message = `Driver ${this.driver.name}`;
            message += this.driver.nightDriving ? " drives at night" : " does not drive at night";
            message += ` and has ${this.driver.experience} years of experience`;
            console.log(message);
        }
    };
}

Truck.prototype.AssignDriver = function(name, nightDriving, experience){
    this.driver = {
        name: name,
        nightDriving: nightDriving,
        experience: experience
    }
}

let truck1 = new Truck("orange", 4600, 70.5, "Volvo", "XC90");
truck1.AssignDriver("Denys Prokopiuk", true, 3); 
console.log("truck1:", truck1);

truck1.trip();

let truck2 = new Truck("black", 6100, 74.5, "Mazda", "MX-5");
truck2.AssignDriver("Denys Prokopiuk", false, 3);
console.log("truck2:", truck2);

truck2.trip();
