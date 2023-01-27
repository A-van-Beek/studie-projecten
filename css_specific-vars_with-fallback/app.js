// Get the root element
var r = document.querySelector(':root');

// Create a function for getting a variable value
function myFunction_get() {
  // Get the styles (properties and values) for the root
  var rs = getComputedStyle(r);
  // Alert the value of the --primary variable
  alert("The value of '--primary' variabele is: " + rs.getPropertyValue('--primary'));
}

// Create a function for setting a variable value
function myFunction_set() {
  // Set the value of variable to another value (in this case "red")
  r.style.setProperty('--primary', "var(--secundary)");
}

const check = True;
const count = 2

