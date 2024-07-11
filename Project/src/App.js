import React, { useState, useEffect } from 'react';
import './app.css';
import MapComponent from './Components/Map';
import ChartComponent from './Components/ChartComponent';
import { FaBolt } from 'react-icons/fa';

function App() {
  const [resultsGeneration, setResultsGeneration] = useState([]);
  const [resultsConsumption, setResultsConsumption] = useState([]);
  console.log(localStorage.setItem('resultsGeneration',[]))
  console.log(localStorage.setItem('resultsConsumption',[]))
  useEffect(() => {
    const fetchData = () => {
      const storedResultsGeneration = localStorage.getItem('resultsGeneration');
      const storedResultsConsumption = localStorage.getItem('resultsConsumption');

      if (storedResultsGeneration && storedResultsGeneration.length > 0) {
        setResultsGeneration(JSON.parse(storedResultsGeneration));
      }

      if (storedResultsConsumption && storedResultsConsumption.length > 0) {
        setResultsConsumption(JSON.parse(storedResultsConsumption));
      }
    };

    fetchData(); 
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', margin: 0 }}>
      <div style={{ background: '#1d485e', padding: '20px', color: 'white', flexShrink: 0 }}>
        <FaBolt style={{ fontSize: '30px' }} /> ELECTRICITY EXCHANGE
      </div>
      <div style={{ background: '#22536b', padding: '20px', color: 'white', flexGrow: 1, display: 'flex' }}>
        <div style={{ flex: 1, background: '#1a4a5e', margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '25px' }}>
          <MapComponent />
        </div>
        <div style={{ flex: 1, background: '#1c4d63', margin: '10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: '#1c5d73', margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {resultsGeneration.length > 0 ? (
              <ChartComponent kWhValues={resultsGeneration} title="Energy Generation (kWh)" />
            ) : (
              <p>Enter date for predict</p>
            )}
          </div>
          <div style={{ flex: 1, background: '#1c6d83', margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {resultsConsumption.length > 0 ? (
              <ChartComponent kWhValues={resultsConsumption} title="Energy Consumption (kWh)" />
            ) : (
              <p>Enter date for predict</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
