// =========================================================================
// verschillende functies aan elkaar rijgen met compose
// =========================================================================

str = "Innovation distinguishes between a leader and a follower.";

// =========================================================================
// De functies zijn geplitst tot single tasks, tevens omgezet naar arrow functies.
// let op: eerste functie heb ik nog uitgeschreven
// pro memorie: arrowfunction: let myFunction = (a, b) => a * b;
// =========================================================================

const trim = function (str) {
  return str.replace(/^\s*|\s*$/g, "");
};
const noPunct = (str) => str.replace(/[?.,!]/g, "");
const capitalize = (str) => str.toUpperCase();
const breakout = (str) => str.split(" ");
const noArticles = (str) => str !== "A" && str !== "AN" && str !== "THE";
const filterArticles = (arr) => arr.filter(noArticles);

//dit is op te lossen met zowel de compose methode als de pipe methode
// nb: nog steeds van rechts naar links (beneden naar boven)
const compose = function (...fns) {
  return function (x) {
    return fns.reduceRight(function (v, f) {
      return f(v);
    }, x);
  };
};

const prepareString = compose(
  filterArticles,
  breakout,
  capitalize,
  noPunct,
  trim
);

// console.log("prepareString", prepareString(str));
