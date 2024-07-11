import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'react-datepicker/dist/react-datepicker.css';
import countriesRight from '../countries-right.json';
import '../customStyles.css';

// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const serbiaFeature = countriesRight.features.find(
    (feature) => feature.properties.NAME === 'Serbia'
  );

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const apiEndpoint = 'http://localhost:8978/api/Prediction/GetExchangeValues';

  const handleGetPredictions = useCallback(async () => {
    try {
      let dayInt = parseInt(day);
      let monthInt = parseInt(month);
      let yearInt = parseInt(year);
  
      if (isNaN(dayInt) || isNaN(monthInt) || isNaN(yearInt)) {
        throw new Error('Invalid date input');
      }
  
  
      const apiUrl = `${apiEndpoint}?day=${dayInt}&month=${monthInt}&year=${yearInt}`;
      console.log('API URL:', apiUrl);
  
      const predictions = await getPrediction(apiUrl);
      console.log(predictions);
  
      const resultsGeneration = predictions.resultsGeneration;
      const resultsConsumption = predictions.resultsConsumption;
  
 
      localStorage.setItem('resultsGeneration', JSON.stringify(resultsGeneration));
      localStorage.setItem('resultsConsumption', JSON.stringify(resultsConsumption));
      
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  }, [day, month, year]);

  async function getPrediction(apiUrl) {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  const style = (feature) => ({
    fillColor: '#3388ff',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  });


  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <MapContainer center={[44.0165, 21.0059]} zoom={7.2} style={{ height: '70%', width: '100%', borderRadius: '25px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {serbiaFeature && <GeoJSON data={serbiaFeature} style={style} />}
      </MapContainer>

      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', marginLeft: '40px' }}>
        <input
          type='text'
          className='custom-input'
          placeholder='Day'
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
        <br />
        <input
          type='text'
          className='custom-input'
          placeholder='Month'
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <br />
        <input
          type='text'
          className='custom-input'
          placeholder='Year'
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <br />
        <button
          style={{ marginLeft: '50px', width: '100px', borderRadius: '5px' }}
          className="custom-button"
          onClick={handleGetPredictions}
        >
          Predict
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
