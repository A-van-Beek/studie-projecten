// =========================================================================
// simpel
// 
// =========================================================================

class Animal {
    constructor(name, species, age) {
        this.name = name;
        this.species = species;
        this.age == age;
    }

    // methods:
    curePet() {
        return `Aww, your ${this.species} is so cute!`
    }

    get agePet() {
        return `Your ${this.species} is ${this.age} years old!`;
        }

    set animalName(name) {
        this.name = name;
        }
}

let dog = new Animal("Spot", "dog", 4)
let bird = new Animal("Feathers", "Bird", 3);
let cat = new Animal("Mochi", "Cat", 2);

// console.log(dog.name) //returns "Spot"
// console.log(dog.species) //returns "Dog"
// console.log(dog.age) //returns 4

// console.log(dog.cutePet()); //returns "Aww, your Dog is so cute!"
/* We no longer need these parentheses as it isn't a function call anymore. */
// console.log(dog.agePet); //returns "Your dog is 4 years old!"

/*We can change our dog's name like so */
dog.animalName = "Fuzzy";
// console.log(dog.name); //returns "Fuzzy"

// =========================================================================
// subclassing
// whera a class inherits features form a parent class, but possesses extra
// features which the parent doesn't
// 
// =========================================================================

class Animals2 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sing() {
        return `${this.name} can sing`;
    }
    dance() {
        return `${this.name} can dance`;
    }
} 
class Cats2 extends Animals2 {
    constructor(name, age, whiskerColor) {
        super(name, age);
        this.whiskerColor = whiskerColor;
    }
    whiskers() {
        return `I have ${this.whiskerColor} whiskers`;
    }
}
// let rosa = new Cats2("Rosa", 33, "indigo");
let pietje = new Animals2("Pietje", 35)

// console.log(rosa.sing()); // "Clara can sing"
// console.log(rosa.whiskers()); // "I have indigo whiskers"
// console.log("obj rosa", rosa)
console.log("obj pietje", pietje)

// when you log the contents of clara in the console, we have:
/*
 * Cats {name: "Clara", age: 33, whiskerColor: "indigo"}
 *  name: "Clara"
 *  age: 33
 *  whiskerColor: "indigo"
 *      ___proto___: Animals
 *          constructor: class Cats
 *          whiskers: f whiskers()
 *          ___proto___:
 *              constructor: class Animals
 *              sing: f sing()
 *              dance: f dance()
 *              ___proto___: object
 */

// using the object.create method approach, the above translates to:

function Animals3(name, age) {
    let newAnimal = Object.create(animalConstructor);
    newAnimal.name = name;
    newAnimal.age = age;
    return newAnimal;
}
let animalConstructor = {
    sing: function() {
        return `${this.name} can sing`;
    },
    dance: function() {
        return `${this.name} can dance`;
    }
}
function Cats3(name, age, whiskerColor) {
    let newCat = Animals3(name, age);
    Object.setPrototypeOf(newCat, catConstructor);
    newCat.whiskerColor = whiskerColor;
    return newCat;
}
let catConstructor = {
    whiskers() {
        return `I have ${this.whiskerColor} whiskers`;
    }
}
Object.setPrototypeOf(catConstructor, animalConstructor);
const ping = Cats3("Clara", 33, "purple");
ping.sing(); // "Clara can sing"
ping.whiskers(); // "I have purple whiskers"


