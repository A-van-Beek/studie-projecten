// import './alert.js';
const punct = '!';

const formatName = function(name) {
  return name.replace(/(\w+), (\w+)/, '$2 $1'); //deze draait lastname firstname om naar first + last
};

const upperCaseName = function(name) {
  return name.toUpperCase();
};

/*const yellName = function(name) {
  return upperCaseName(name) + punct;
};*/

export default function yellName(name) { //dit is een function declaration
    return upperCaseName(name) + punct;
};

//export { yellName, formatName }; //alternatieve manier van export //dit is een function expression