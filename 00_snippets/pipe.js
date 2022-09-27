str = "Innovation distinguishes between a leader and a follower.";

// manier 3: geplitst tot single tasks, tevens omgezet naar arrow functies.
// let op: eerste functie heb ik nog uitgeschreven
// pm: arrowfunction: let myFunction = (a, b) => a * b;

const trim1 = function (str) {
  return str.replace(/^\s*|\s*$/g, "");
};
const noPunct1 = (str) => str.replace(/[?.,!]/g, "");
const capitalize1 = (str) => str.toUpperCase();
const breakout1 = (str) => str.split(" ");
const noArticles1 = (str) => str !== "A" && str !== "AN" && str !== "THE";
const filterArticles1 = (arr) => arr.filter(noArticles);

const pipe = function (...fns) {
  return function (x) {
    return fns.reduce(function (v, f) {
      return f(v);
    }, x);
  };
};

const prepareString1 = pipe(
  trim1,
  noPunct1,
  capitalize1,
  breakout1,
  filterArticles1
);

// console.log("prepareString", prepareString(str1));
