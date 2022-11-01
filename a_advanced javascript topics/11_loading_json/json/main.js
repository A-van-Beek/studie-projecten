var MAINAPP = (function(app) {
    var jsonObj = {};

    var loadJSON = function(path) {
        var xobj = new XMLHttpRequest(); // stap 1 = definieer nieuw object
        xobj.overrideMimeType('application/json'); //optioneel, pas mime type aan
        xobj.open('GET', path); 
        xobj.onreadystatechange = function() { //dit is de callback
            if (xobj.readyState === 4) {
                app.jsonObj = JSON.parse(xobj.responseText);
            }
        };
        xobj.send(null);
    };

    app.jsonObj = jsonObj;
    app.loadJSON = loadJSON;
    return app;
})(MAINAPP || {});