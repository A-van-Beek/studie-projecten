//Open the json file and then populate learnjs.html with the data from the json file. 
//document.getElementsByTagName()
//document.getElementById()
//innerHTML();

var MAINAPP = (function(app) {
    var jsonObj = {},
        doc = document;

    var loadJSON = function(path) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType('application/json'); //aanpassen mime type
        xobj.open('GET', path); //open the object
        xobj.onreadystatechange = function() { //wachten tot geladen is.. (=callbackfie)
            if (xobj.readyState === 4) { //als deze klaar is (uitslag 4):
                jsonObj = JSON.parse(xobj.responseText); //maak het object af.
                populateHtml(); //dit is de tweede functie die aangeroepen wordt
            }
        };
        xobj.send(null);
    };

    var populateHtml = function() {
        var li = doc.getElementsByTagName('li'); //zoek alle elementen by tagname (li)
        // var tmp = doc.getElementsByTagName('h2') //dit is een nodelist (HTMLCollection)!
        // console.log(tmp)

        doc.getElementsByTagName('h2')[0].innerHTML = jsonObj.heading; //geef de juiste innderHTML
        
        for (let i = 0;i < li.length;i++) {
            console.log(li)
            li[i].innerHTML = jsonObj.bullets['b' + (i + 1)];
        }
    };

    loadJSON('data.json');

    app.populateHtml = populateHtml;
    return app;
})(MAINAPP || {});


