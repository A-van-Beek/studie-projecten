/*
A closure is the combination of a function bundled together
(enclosed) with references to its surrounding state
(the lexical environment). In other words, a closure
gives you access to an outer function's scope from an
inner function. In JavaScript, closures are created
every time a function is created, at function creation time.
 */


// // voorbeeld van scope
// var funct1 = function() {
//     var a = 2,
//         b = 3;

//     var funct2 = function() {
//         console.log(a + b);
//     };

//     funct2();
// };

// funct1();

// // voorbeeld van closure
// // funct1 is gesloten als func2 gaat starten,
// // toch kan func2 de twee variabelen gebruiken
// var funct1 = function() {
//     var a = 2,
//         b = 3;

//     var funct2 = function() {
//         console.log(a + b);
//     };

//     setTimeout(funct2, 3000); //na 3 seconden funct2 starten
// };

// funct1();

// voorbeeld met eventHandlers
// let op: deze hoort bij learnjs.html

/*
    beide anonieme functies behouden een referentie naar de
    variabelen die in de oorspronkelijke functie gedefinieerd zijn.
*/

// var counter = function() {
//     var cnt = 0,
//         item1 = document.querySelector("#item1"),
//         item2 = document.querySelector("#item2");

//     var print = function() {
//         console.log(cnt);
//     };
//     item1.addEventListener("click", function() {
//         cnt++;
//         print();
//     });
//     item2.addEventListener("click", function() {
//         cnt++;
//         print();
//     });
// };
// counter()
// verkorte schrijfwijze:
(function() {
    var cnt = 0,
        item1 = document.querySelector("#item1"),
        item2 = document.querySelector("#item2");

    var print = function() {
        console.log(cnt);
    };
    item1.addEventListener("click", function() {
        cnt++;
        print();
    });
    item2.addEventListener("click", function() {
        cnt++;
        print();
    });
})();