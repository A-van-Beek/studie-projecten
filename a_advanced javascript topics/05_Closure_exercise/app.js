
//Add a click handler to the javascript logo.
// The first time it is clicked after the page loads,
//display to the console: "You have clicked this logo for the first time."

//The second and subsequent clicks, display "You have clicked the logo again."

//Create this without using any global variables.

(function() {
    var counter = 0,
        doc = this.document;

    doc.getElementById('logo').addEventListener("click", function(e) {
        if (counter === 0) {
            console.log("You have clicked this logo for the first time.")
        }
        else {
            console.log("You have clicked the logo again.")
        }
        counter++;
    })
})();
