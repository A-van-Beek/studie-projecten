// =========================================================================
// Set in javascript
//
// https://www.taniarascia.com/understanding-map-and-set-javascript/
//
//
// --- new Set()    maak nieuwe set

// 
//
/* =========================================================================

what is:
A Set is a collection of unique values.
Unlike a Map, a Set is conceptually more similar to an Array than an Object,
since it is a list of values and not key/value pairs. However, Set is not a
replacement for Arrays, but rather a supplement for providing additional
support for working with duplicated data.

When to use Set:
Set is a useful addition to your JavaScript toolkit,
particularly for working with duplicate values in data.

In a single line, we can create a new Array without duplicate values from an Array that has duplicate values.

Set can be used for finding the union, intersection, and difference between two sets of data.
However, Arrays have a significant advantage over Sets for additional manipulation of the data
due to the sort(), map(), filter(), and reduce() methods, as well as direct compatibility with JSON methods.



Remember:
Since set can only contain unique values, any attempt to add a value that already
exists will be ignored.

How to use Set
- add()   ads an item to an set
- delete()
- has()
- clear()
- size
 =========================================================================*/
//
//
const mySet = new Set()
mySet.add("Beethoven")
mySet.add("Mozart")
mySet.add("Chopin")

// you can also initialize sets with an array of values. If there are duplicata values in the array,
// they will be removed from the set

const myNewSet = new Set(["Beethoven", "Mozart", "Chopin", "Chopin"])

//convert a set into an array
const myArray = [...myNewSet]


// iteration
const mySetIteration = new Set(['hi', 'hello', 'good day'])

// // Iterate a Set with forEach
// mySetIteration.forEach((value) => console.log("forEach: ", value))

// // Iterate a Set with for...of
// for (const value of mySetIteration) {
//   console.log("for...of: ", value)
// }

