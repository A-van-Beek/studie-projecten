// =========================================================================
// pro memorie: arrowfunction: let myFunction = (a, b) => a * b;
// =========================================================================

//uitgeschreven
const trim1 = function (str) {
    return str.replace(/^\s*|\s*$/g, "");
  };

//als arrowfunction

const trim2 = (str) => str.replace(/^\s*|\s*$/g, "")