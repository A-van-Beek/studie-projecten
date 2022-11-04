// =========================================================================
// Map en Set in javascript
//
// https://www.taniarascia.com/understanding-map-and-set-javascript/
//
// - maps accept any data type as a key
// - maps do NOT allow duplicate key values
//
// --- set()    maak nieuwe entry
// --- delete() delete entry
// --- has()    kijk of entry aanwezig is
// --- get()    geef waarde van de key
// --- size     geef aantal / lengte
// --- clear()  maak leeg
//
// --- keys()   return a 'map-iterator' met de keys (vgl array)
// --- values() return a 'map-iterator' met de values
// --- entries() return an array of key/value pairs
// 
//
/* =========================================================================
When to Use Map
Summing up, Maps are similar to Objects in that they hold key/value pairs,
but Maps have several advantages over objects:
- Size - Maps have a size property, whereas Objects do not have a built-in way to retrieve their size.
- Iteration - Maps are directly iterable, whereas Objects are not.
- Flexibility - Maps can have any data type (primitive or Object) as the key to a value,
  while Objects can only have strings.
- Ordered - Maps retain their insertion order, whereas objects do not have a guaranteed order.

Due to these factors, Maps are a powerful data structure to consider. However, Objects haves some important advantages as well:

- JSON - Objects work flawlessly with JSON.parse() and JSON.stringify(),
  two essential functions for working with JSON, a common data format that many REST APIs deal with.
- Working with a single element - Working with a known value in an Object,
  you can access it directly with the key without the need to use a method, such as Map's get().

This list will help you decide if a Map or Object is the right data structure for your use case.
 =========================================================================*/
//
//
/** Maps, are ordered collections of key/value pairs  */

const map = new Map();

/* You can add values to a map with the set() method.
 * The first argument will be the key, and the second argument will be the value. */

map.set("firstname", "Luke");
map.set("lastname", "Skywalker");
map.set("occupation", "Jedi Knight");

/*console.log:
Map(3)
0: {"firstName" => "Luke"}
1: {"lastName" => "Skywalker"}
2: {"occupation" => "Jedi Knight"}
*/

//met directe vulling:
const map2 = new Map([
  ["firstName", "Luke"],
  ["lastName", "Skywalker"],
  ["occupation", "Jedi Knight"],
]);

//op deze manier kan je eenvoudig een object omzetten naar een map
const obj2 = {
  firstName: "Luke",
  lastName: "Skywalker",
  occupation: "Jedi Knight",
};

//convert a map to an object
const obj = Object.fromEntries(map2);

//convert object to an map
const map4 = new Map(Object.entries(obj));

//convert map to an array
const newArray = Array.from(map);

// console.log("map2, directe vulling", map2)
// console.log("map -> object", map2, obj )
// console.log("object -> map", obj, map4)
// console.log("map -> array", map, newArray)

// - maps do NOT allow duplicate key values
myMap = new Map();
myMap.set("1", "string 1");
myMap.set(1, "this will be overwritten");
myMap.set(1, "number 1");
myMap.set(true, "a boolean");

// console.log("myMap", myMap)

// built-in properties:
// Initialize a new Map
const myMapBuiltIn = new Map([
  ["animal", "otter"],
  ["shape", "triangle"],
  ["city", "New York"],
  ["country", "Bulgaria"],
]);

// Check if a key exists in a Map
myMapBuiltIn.has("shark"); // false
myMapBuiltIn.has("country"); // true

// Get an item from a Map
myMapBuiltIn.get("animal"); // "otter"

// Get the count of items in a Map
myMapBuiltIn.size; // 4

// Delete an item from a Map by key
myMapBuiltIn.delete("city"); // true (item existed and was deleted)

// Empty a Map
myMapBuiltIn.clear();

// ==============================================================================================
// Iteration with Map
// ==============================================================================================

/**
 * Map has a built-in forEach method, similar to an Array, for built-in iteration.
 * However, there is a bit of a difference in what they iterate over.
 * The callback of a Map's forEach iterates through the value, key,
 * and map itself, while the Array version iterates through the item, index,
 * and array itself.
 */

// // Map
// myMap.prototype.forEach((value, key, map) = () => {}

// // Array
// myArray.prototype.forEach((item, index, array) = () => {}

// voorbeeld:

const myMap3 = new Map([
  [1970, "bell bottoms"],
  [1980, "leg warmers"],
  [1990, "flannel"],
]);
// // Log the keys and values of the Map with forEach
// myMap3.forEach((value, key) => {
//   console.log(`${key}: ${value}`);
// });

/*this will give:
1970: bell bottoms
1980: leg warmers
1990: flannel
*/

/* Since a for...of loop iterates over iterables like Map and Array,
we can get the exact same result by destructuring the array of Map items:
*/

// // Destructure the key and value out of the Map item
// for (const [key, value] of myMap3) {
//   // Log the keys and values of the Map with for...of
//   console.log(`variant2: ${key}: ${value}`);
// }
