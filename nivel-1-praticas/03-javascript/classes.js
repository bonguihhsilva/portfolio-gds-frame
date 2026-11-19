class Car {
constructor(make, model) {
this.make = make;
this.model = model;
}

displayInfo() {
return `${this.make} ${this.model}`;
}

static factoryCar(make, model) {
return new Car(make, model);
}
}

let myCar = Car.factoryCar('Toyota', 'Corolla');
console.log(myCar.displayInfo());