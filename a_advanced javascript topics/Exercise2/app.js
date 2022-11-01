var content = document.querySelector('#content');

content.innerHTML = "President " + pres.fullName() + " was president number " + pres.order + " of the United States of America.";

console.log("----- alle properties ----")
// Print to the console all the properties the object has access to.
// Also print the data type for those properties.
for (var prop in pres) {
    console.log(prop + "  " + typeof pres[prop]);
}
console.log("----- own properties ----")
// Print to the console a similar list but only include the
// properties owned by the object.
// nu vallen de functies weg! (fullName, inaugusationAge, daysServed)
for (var prop in pres) {
    if (pres.hasOwnProperty(prop)) {
        console.log(prop + "  " + typeof pres[prop]);
    }
}

console.log("----- own properties, optie 2 ----")
// tweede optie voor de tweede for-loop:
var arr = Object.keys(pres)
for (let i = 0; i <arr.length; i++) {
    console.log(arr[i] + "  " + typeof pres[arr[i]]);
}