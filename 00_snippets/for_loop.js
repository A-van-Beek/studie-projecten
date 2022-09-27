const scores = [2, 5, 7, 1]

let average = function(scores) {
    var total = 0;
    for (let i = 0; i < scores.length; i++) {
        total += scores[i];
        console.log("item,",scores[i])
        console.log("totaal", total)
    }
    return total/scores.length;
}

// average(scores)