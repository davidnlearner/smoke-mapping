import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiZGxlYXJuZXIiLCJhIjoiY2toeTBuN3BmMGJ4bjJxb2RxdWF4Njl0OCJ9.smv24AHKxEoZqLvWKcJOBw';


function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-97.5);
  const [lat, setLat] = useState(39);
  const [zoom, setZoom] = useState(3.1);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const bounds = [
    [-124.410607, 25.840438], // Southwest coordinates
    [-66.981903, 47.459534] // Northeast coordinates
  ];


  window.addEventListener('resize', () => {
    setWindowHeight(window.innerHeight);
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/dlearner/cla8f4l7s000d14rvjltvptme', //style url
      center: [lng, lat],
      zoom: zoom,
      // maxBounds: bounds // Set the map's geographical boundaries.
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div id='test'>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" style={{ height: windowHeight }} />
    </div>
  );
}

export default App;
