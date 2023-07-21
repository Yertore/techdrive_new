import React, { useState } from 'react';
import axios from 'axios';

const config = {
  apiKey: '1pfFmMtiUKWYo+drdaoZkg==ijG7JvPlZcQdHshD',
  apiUrl: 'https://api.open-meteo.com/v1/forecast',
  logRequests: true, // Set to true to enable logging requests
};

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [log, setLog] = useState([]);

  const handleGetForecast = async () => {
    try {
      if (!city) {
        alert('Please enter a city or its coordinates.');
        return;
      }

      // Fetch weather data for the city
      const response = await axios.get(`${config.apiUrl}?city=${city}&apiKey=${config.apiKey}`);

      // Simulate logging the request, response, date, and city to the console
      if (config.logRequests) {
        const logEntry = {
          request: `${config.apiUrl}?city=${city}`,
          response: response.data,
          date: new Date().toISOString(),
          city,
        };
        console.log('Log Entry:', logEntry);
        setLog((prevLog) => [...prevLog, logEntry]);
      }

      // Update forecast data state
      setForecastData(response.data.data);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      alert('Error fetching weather data. Please check the console for details.');
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city or coordinates"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleGetForecast}>Get Forecast</button>
      {forecastData.length > 0 && (
        <div>
          <h2>Weather Forecast</h2>
          <ul>
            {forecastData.map((forecast) => (
              <li key={forecast.timestamp}>{/* Display forecast data here */}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;