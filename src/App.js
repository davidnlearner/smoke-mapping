import './App.css';
import ControlBox from './components/ControlBox';
import Legend from './components/Legend';
import InfoBox from './components/InfoBox';
import React, { useRef, useEffect, useState } from 'react';

import { dateConversion } from './utils/dateUtils';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import mapboxSecrets from './secrets/mapbox.json';

mapboxgl.accessToken = mapboxSecrets.api_token;


function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const START_YEAR = 2006;
  const START_MONTH = 1;

  const [mapboxMap, setMapboxMap] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);

  const [currentDate, setCurrentDate] = useState(10);
  const [datesLength, setDateLength] = useState(1);

  const [lng, setLng] = useState(-97.5);
  const [lat, setLat] = useState(39);
  const [zoom, setZoom] = useState(3.1);
  const [countyData, setCountyData] = useState(null);
  const bounds = [
    [-124.410607, 25.5], // Southwest coordinates (west, south)
    [-66.981903, 49] // Northeast coordinates (east, north)
  ];
  const legendColors = [0,
    'green',
    50,
    'yellow',
    100,
    'orange',
    200,
    'red',
    300,
    'maroon'];


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
      maxZoom: 11
      // zoom: zoom,
    });
    map.current.fitBounds(bounds, { animate: false, padding: 32 });
    map.current.setMaxBounds(map.current.getBounds());

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    loadData();
    if (countyData !== null) {
      setSmokeData();
    }
  }, []);

  useEffect(() => {
    if (countyData === null) {
      return;
    }
    addCountyLayer(countyData, map, legendColors);

  }, [countyData]);

  useEffect(() => {
    if (countyData !== null) {
      setSmokeData(currentDate);
    }
  }, [currentDate]);

  const loadData = async () => {
    const countyResponse = await fetch('/data/mergedData.json');
    const countyData = await countyResponse.json();

    countyData.features.forEach(feature => {
      feature.properties.smokeCover = feature.properties.smokeCover || -1;
      feature.properties.smokeCoverAllDates = feature.properties.smokeCoverAllDates.map(d => d === null ? -1 : d);
    });

    countyData.features.forEach(feature => {
      feature.properties.smokeCover = Number(feature.properties.smokeCoverAllDates[currentDate]);
    });

    setDateLength(countyData.features[0].properties.smokeCoverAllDates.length);
    setCountyData(countyData);
  };

  const setSmokeData = async (currentDate) => {

    countyData.features.forEach(feature => {
      feature.properties.smokeCover = Number(feature.properties.smokeCoverAllDates[currentDate]);
    });

    setCountyData(countyData);
    addCountyLayer(countyData, map, legendColors);
  };

  const addCountyLayer = (countyData, map, legendColors) => {
    const layerId = "county-data";

    if (map.current.getSource(layerId)) {
      map.current.getSource(layerId).setData(countyData);
    } else {
      map.current.addSource(layerId, { type: 'geojson', data: countyData });
    }
    if (!map.current.getLayer(layerId)) {
      map.current.addLayer({
        id: layerId, source: layerId, type: 'fill', paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'smokeCover'],
            ...legendColors
          ],
          'fill-opacity': ["case", ["==", ["get", "smokeCover"], -1], 0, 0.5]
        }
      });
    }
  };

  return (
    <div>
      <div className='ui-wrapper'>
        <ControlBox datesLength={datesLength} currentDate={currentDate} startYear={START_YEAR} setCurrentDate={setCurrentDate} />
        <Legend legendColors={legendColors} />
      </div>
      <div ref={mapContainer} className="map-container" />
      <InfoBox />
    </div>
  );
}

export default App;
