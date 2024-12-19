import React, { useState } from "react";
import axios from "axios";
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        `https://my-mern-backend-wiel.onrender.com`,
        {
          params: {
            q: city,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            units: "metric",
          },
        }
      );

      setWeatherData(response.data);
      setCity("");
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred"
      );
    }
  };

  return (
    <div className="weather-container">
      <h2 className="weather-header">Weather Information</h2>
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <div className="weather-detail">
          <span>{weatherData.name}</span>
          <span>{Math.round(weatherData.main.temp)} °C</span>
          <span>{weatherData.weather[0].description}</span>
        </div>
      )}
    </div>
  );
};

export default Weather;










