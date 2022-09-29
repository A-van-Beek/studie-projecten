// =========================================================================
// maakt een loop door het array en maakt een nieuw array
// =========================================================================

let mapArray = [1,2,3,4,5];
let newMapArray = arr.map(function(val, index, array) {
    // console.log("val", val);
    // console.log("index", index);
    // console.log("array", array);
    return val * val
    // return val ** 2 (nieuwere notatie)
})

// console.log("newMapArray", newMapArray)