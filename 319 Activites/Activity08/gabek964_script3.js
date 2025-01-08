class Rectangle {
  #width;
  #height;

  constructor(width, height) {
    this.width = width; // Calls the setter for width
    this.height = height; // Calls the setter for height
  }

  set width(value) {
    if (typeof value !== 'number' || value <= 0 || isNaN(value)) {
      throw new Error("Width must be a positive number");
    }
    this.#width = value;
  }

  get width() {
    return this.#width;
  }

  set height(value) {
    if (typeof value !== 'number' || value <= 0 || isNaN(value)) {
      throw new Error("Height must be a positive number");
    }
    this.#height = value;
  }

  get height() {
    return this.#height;
  }

  area() {
    return this.#width * this.#height;
  }
}

const w = parseFloat(prompt("Enter width:"));
const h = parseFloat(prompt("Enter height:"));

// Ensure the user input is valid
if (isNaN(w) || isNaN(h)) {
  console.error("Invalid input for width or height.");
} else {
  const rectangle = new Rectangle(w, h);
  console.log("Show output >");
  console.log(`The area of a rectangle with Width ${rectangle.width} and Height ${rectangle.height} is ${rectangle.area()}`);
}

class Circle {
  #radius;

  constructor(radius) {
    this.radius = radius; // Calls the setter for radius
  }

  set radius(value) {
    if (typeof value !== 'number' || value <= 0 || isNaN(value)) {
      throw new Error("Radius must be a positive number");
    }
    this.#radius = value;
  }

  get radius() {
    return this.#radius;
  }

  area() {
    return Math.PI * (this.#radius ** 2);
  }
}

console.log("Input data >");
const r = parseFloat(prompt("Enter radius:"));

// Ensure the user input is valid
if (isNaN(r)) {
  console.error("Invalid input for radius.");
} else {
  const circle = new Circle(r);
  console.log("Show output >");
  console.log(`The area of a circle with Radius ${circle.radius} is ${circle.area().toFixed(2)}`);
}
