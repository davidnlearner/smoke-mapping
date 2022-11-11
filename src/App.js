import './App.css';
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { csvParse } from 'd3-dsv';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGxlYXJuZXIiLCJhIjoiY2toeTBuN3BmMGJ4bjJxb2RxdWF4Njl0OCJ9.smv24AHKxEoZqLvWKcJOBw';


function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [mapboxMap, setMapboxMap] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);

  const [currentDate, setCurrentDate] = useState(200601);

  const [lng, setLng] = useState(-97.5);
  const [lat, setLat] = useState(39);
  const [zoom, setZoom] = useState(3.1);
  const [countyData, setCountyData] = useState(null);
  const bounds = [
    [-124.410607, 25.840438], // Southwest coordinates (west, south)
    [-66.981903, 47.459534] // Northeast coordinates (east, north)
  ];


  window.addEventListener('resize', () => {
    if (map.current) {
      map.current.resize();
    }
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/dlearner/cla8f4l7s000d14rvjltvptme', //style url
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.fitBounds(bounds, { animate: false, padding: 10 });
    map.current.setMaxBounds(map.current.getBounds());

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    loadData();
    setSmokeData();
  }, []);

  useEffect(() => {
    if (countyData === null) {
      return;
    }
    addCountyLayer(countyData, map);

  }, [countyData]);

  useEffect(() => {
    setSmokeData(currentDate);
  }, [currentDate]);

  const loadData = async () => {
    const countyResponse = await fetch('/data/mergedData.json');
    const countyData = await countyResponse.json();
    setCountyData(countyData);
  };

  const setSmokeData = async (currentDate) => {
    const countyResponse = await fetch('/data/mergedData.json');
    const countyData = await countyResponse.json();
    // console.log(currentDate); it returns as non sometimes
    // const year = currentDate / 100;
    // const month = currentDate % 100;
    const year = 2018;
    const month = 10;
    const index = (year - 2006) * 12 + month;
    // console.log(index);

    countyData.features.forEach(feature => {
      feature.properties.smokeCover = Number(feature.properties.smokeCoverAllDates[index]);

    });
    setCountyData(countyData);
  };

  const addCountyLayer = (countyData, map) => {
    const layerId = "county-data";
    map.current.addSource(layerId, { type: 'geojson', data: countyData });
    map.current.addLayer({
      id: layerId, source: layerId, type: 'fill', paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'smokeCover'],
          0,
          '#FFD500',
          5,
          '#FEAA0F',
          10,
          '#FC851F',
          25,
          '#FB672E',
          50,
          '#FA4E3D'
        ], 'fill-opacity': .5
      }
    });
  };






  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
