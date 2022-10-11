// =========================================================================
// pro memorie: arrowfunction: let myFunction = (a, b) => {a * b};
// 
// niet alleen de voorkeur vanwege consistentie,
// maar ook: functies worden automatisch naar retrospectief
// geactiveerd (naar boven toe), wat voor verwarring kan zorgen.
// (bij VAR gebeurd hetzelfde)
// als arrowfunction gaat deze pas gelden in de regel
// waarin deze is geschreven. 
// =========================================================================

//uitgeschreven
const trim1 = function (str) {
    return str.replace(/^\s*|\s*$/g, "");
  };

//als arrowfunction (voorkeur!)

const trim2 = (str) => str.replace(/^\s*|\s*$/g, "")