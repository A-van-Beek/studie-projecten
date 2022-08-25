//________________ arrow function _____________________
// uitgeschreven:
var sum = function(num1, num2) {
    return num1 + num2;
};

var sumArrow = (num1, num2) => num1 + num2;

//met één argument:
var funct1 = num => num * num;

//zonder argument:
var funct2 = () => 100;

//________________ callback _____________________

// meest eenvoudige callback-functie:
function doFirst(callback) {
	// hoop ingewikkelde code
	console.log("First");
	
	if (callback !== undefined) {
		callback();
	}
}

//(optie 1) geen parameter meegeven, dus alleen First
doFirst() 

// //(optie 2) nu een tweede functie als callback meegegeven.
// doFirst(function doSecond() {
// 	console.log("Second");
// });


// //(optie 3) andere methode van noteren = hetzelfde als 2
// doFirst(() => console.log("Second"))

// //een ander voorbeeld
// function myDisplayer(something) {
//   console.log(something)
// }

// function myCalculator(num1, num2, myCallback) {
//   let sum = num1 + num2;
//   myCallback(sum);
// }

// myCalculator(2, 5, myDisplayer)