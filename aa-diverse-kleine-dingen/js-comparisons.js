/*achterhalen betekenis !currentSelected.has(id)
Let op: run code lokaal via: node indexedDB.js
of via pijltje run (rechtsboven)

zie ook: https://www.w3schools.com/js/js_comparisons.asp

*/



// Create a Set
const letters = new Set();

// Create Variables
const a = "a";
const b = "b";
const c = "c";

// Add the Variables to the Set
letters.add(a);
letters.add(b);
letters.add(c);

// console.log(letters) //geeft: Set(3) { 'a', 'b', 'c' }
// console.log(!letters) //geeft false
console.log(!letters.has("d")) // geeft true
    //hier staat ook: staat letter "d" NIET in de set? 
console.log(letters.has("a"))
