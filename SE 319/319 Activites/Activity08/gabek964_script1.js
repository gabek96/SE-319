console.log("Exercise 1");
console.log("------------------------");

function maxOfTwo(n1, n2) {
  if (n1 >= n2) {
    return n1;
  } else {
    return n2;
  }
}

console.log("Exercise 2");
console.log("------------------------");

function maxOfArray(array) {
  if (array.length === 0) {
    return null;
  }
  let max = array[0]; // Start with the first element

  for (let i = 1; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i]; // Update max if current element is greater
    }
  }

  return max;
}

console.log("Exercise 3");
console.log("------------------------");

function showProperties(movie) {
  let propertyNames = [];
  let propertyValues = [];

  for (let key in movie) {
    propertyNames.push(key);
    propertyValues.push(movie[key]);
  }

  console.log("Property Names:");
  console.log(propertyNames);
  console.log("Property Values:");
  console.log(propertyValues);
}

console.log("Exercise 4");
console.log("------------------------");

class Circle {
  constructor(radius) {
    this.radius = radius;
    this.area = function () {
      return Math.PI * this.radius * this.radius;
    };
  }
}

const circle = new Circle(2);

console.log("Exercise 7");
console.log("------------------------");

const grade = {
  math: 86,
  science: 90,
  history: 78,
  literature: 98,
};

const calculateAverageGrade = function (grades) {
  let total = 0;
  let count = 0;

  for (let subject in grades) {
    total += grades[subject];
    count += 1;
  }

  return total / count;
};

console.log("Exercise 8");
console.log("------------------------");

function calculateAverageGradePerStudent(students) {
  const averageGrades = {};

  students.forEach((student) => {
    const studentName = Object.keys(student)[0];
    const grades = Object.values(student)[0];
    const sumOfGrades = Object.values(grades).reduce((acc, grade) => acc + grade, 0);
    const averageGrade = sumOfGrades / Object.keys(grades).length;
    averageGrades[studentName] = averageGrade.toFixed(2);
  });

  return averageGrades;
}
