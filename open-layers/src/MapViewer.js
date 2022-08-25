import React from 'react';
import * as ol from "ol";
// import 'ol/ol.css';
import "./MapViewer.css";
import {useGeographic} from 'ol/proj';

import TileLayer from 'ol/layer/Tile';
import VectorTileSourceOSM from 'ol/source/OSM';


function MapViewer() {
  // Declare a Tile layer with an OSM source
  var osmLayer = new TileLayer({
    source: new VectorTileSourceOSM(),
  });
  // // Create latitude and longitude and convert them to default projection
  // var birmingham = ol.proj.transform([-1.81185, 52.44314], 'EPSG:4326', 'EPSG:3857');
  
  // Create a View, set it center and zoom level
  var view = new ol.View({
    // center: birmingham,
    center: [150000, 450000],
    zoom: 6,
  });
  // Instanciate a Map, set the object target to the map DOM id
  var map = new ol.Map({
    target: "map",
  });
  // Add the created layer to the Map
  map.addLayer(osmLayer);
  // Set the view for the map
  map.setView(view);

  const bodyMap = document.getElementById("map")
  bodyMap.innerHTML = map.setView(view)

  return (
    <div>
      <h5>kaartbeeld</h5>
      <div className="map-container">
        <div id="map" className="map">{bodyMap}</div>
      </div>
    </div>
  );
}

export default MapViewer;