// In this exercise you will create 3 separate functions.
// Each function must be set up to immediately invoke. In other words, you will create three separate immediately invoked function expressions.

    // Create a function that adds two numbers and assigns it to a variable by returning the sum.
    // Create a function that multiplies the results of the previous function by itself and stores product in a second variable.
    // Create a function that prints to the console the variable that contains the results of the second function you created.

var sum = function(num1, num2) {
    return num1 + num2;
}(2, 2)

var multi = function() {
    return sum * sum;
}();

(function() {
    console.log(multi);
}());

