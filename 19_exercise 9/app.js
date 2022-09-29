//Create a function that will take the array and a student id (any number you want)
//as parameters. Use map to create a new array that stores each score in an object
//that includes the activity ID (first score is 0, second score 1, etc.) as well as the student ID. 

//Create a function that will create a new array with the lowest score removed.
//(For this exercise if both 0s are removed that is OK.)

//Create a function that will Sum the scores.

//Create a function that will compute the average from an array passed in.

//Create a function that will create a new array of score objects that have a 0 score.

//Using the functions you have created, generate a new array with full data.
//Compute the average once the lowest score has been removed. And create an array of
//zero scores with the full data that could be provided to the learner.

const array = [10, 0, 90, 80, 50, 0, 60];
const studentId = 1001;

const mapStudentData = function(array, sId) {
    return array.map(function(val, index) {
        return {
            studentId: sId,
            activityId: index,
            score: val
        }
    })
}

//om beide 0-waarden te verwijderen:
const removeLowScore = function(arr) {
    const min = Math.min(...arr.map(val => val.score));
    return arr.filter(elem => elem.score !== min);
};

//als je alleen de eerste wil verwijderen:
const removeLowScoreSolo = function(arr) {
    let min = Math.min(...arr.map(val => val.score));
    return arr.reduce(function(result, elem, index) {
        if (elem.score !== min) {
            return [...result, elem];
        }
        if (elem.score === min) {
            min = null;
            return result;
        }
    }, []);
};

// of via findindex
// NB side effect !! hij wijzigt het basis-array !
//oplossen door het array te clonen
const removeLowScore2 = function(arr) {
    const min = Math.min(...arr.map(val => val.score));
    arr.splice(arr.findIndex(elem => elem.score === min), 1) //eerste waarde is positie die verwijderd wordt, tweede het aantal entries
    return arr;
};



const sumScoreAttribute = function(arr) {
    return arr.reduce((result, elem) => result + elem.score, 0);
};

const computeAverage = function(arr) {
    return sumScoreAttribute(arr) / arr.length;
};

const filterZeroScores = function(arr) {
    return arr.filter(elem => elem.score === 0);
};

const fullData = mapStudentData(array, studId);

const lowValueRemoved = removeLowScore(fullData);

const highAverage = computeAverage(lowValueRemoved); //deze geeft gemiddelde exclusief 0-waarden

const lowAverage = computeAverage(fullData);  //deze geeft gemiddelde inclusief 0-waarden

const zeroAssignments = filterZeroScores(fullData);





