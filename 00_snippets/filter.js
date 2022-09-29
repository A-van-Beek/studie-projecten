// =========================================================================
// maakt een loop door het array, en maakt een nieuw array van een subset
// =========================================================================

let filterArray = [1,2,3,4,5];
let newFilterArray = arr.filter(function(val) {
    return val < 3
})

console.log("newFilterArray", newFilterArray)