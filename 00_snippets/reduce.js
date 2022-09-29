// =========================================================================
// maakt een loop door het array, waarbij elk element door de functie gestuurd wordt
// in het voorbeeld is de eerste keer de waarde van de accumulator 0
// =========================================================================

let arr = [1,2,3,4,5];
let total = arr.reduce(function(accumulator, elem) {
    return accumulator + elem;
}, 0)

// console.log("arr", arr)
// console.log("total", total)