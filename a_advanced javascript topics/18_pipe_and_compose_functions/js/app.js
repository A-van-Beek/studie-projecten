str = "Innovation distinguishes between a leader and a follower.";

// bij begin: een uitgebreide manier van schrijven
let prepareString = function () {
  let str1 = str.trim();
  let str2 = str1.replace(/[?.,!]/g, "");
  let str3 = str2.toUpperCase();
  let arr = str3.split(" ");

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === "A" || arr[i] === "AN" || arr[i] === "THE") {
      arr.splice(i, 1);
    }
  }
  return arr;
};
// console.log("optie 1", prepareString(str))

// een verkorte versie, ketting-reactie
let prepareString2 = function () {
  let arr = str
    .trim()
    .replace(/[?.,!]/g, "")
    .toUpperCase()
    .split(" ");
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === "A" || arr[i] === "AN" || arr[i] === "THE") {
      arr.splice(i, 1);
    }
  }
  return arr;
};
// console.log("optie 2", prepareString2(str))

// manier 3: geplitst tot single tasks, tevens omgezet naar arrow functies.
// let op: eerste functie heb ik nog uitgeschreven
// pm: arrowfunction: let myFunction = (a, b) => a * b;

const trim = function (str) {
  return str.replace(/^\s*|\s*$/g, "");
};
const noPunct = (str) => str.replace(/[?.,!]/g, "");
const capitalize = (str) => str.toUpperCase();
const breakout = (str) => str.split(" ");
const noArticles = (str) => str !== "A" && str !== "AN" && str !== "THE";
const filterArticles = (arr) => arr.filter(noArticles);

// via nesting weer terug, moeilijk te lezen en te interpreteren
// console.log(filterArticles(breakout(capitalize(noPunct(trim(str))))));

//dit is op te lossen met zowel de compose methode als de pipe methode
// nb: nog steeds van rechts naar links (beneden naar boven)
const compose = function (...fns) {
  return function (x) {
    return fns.reduceRight(function (v, f) {
      return f(v);
    }, x);
  };
};

const prepareString3 = compose(
  filterArticles,
  breakout,
  capitalize,
  noPunct,
  trim
);

// console.log("prepareString3", prepareString3(str));

const pipe = function (...fns) {
  return function (x) {
    return fns.reduce(function (v, f) {
      return f(v);
    }, x);
  };
};

const prepareString4 = pipe(
  trim,
  noPunct,
  capitalize,
  breakout,
  filterArticles
);

console.log("prepareString4", prepareString4(str));
