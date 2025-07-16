const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // v2.6.7 required
require('dotenv').config();

const app = express();
const PORT = 3690;
const API_KEY = process.env.WEATHER_API_KEY;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Weather API routerr
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(city)}&appid=${API_KEY}`;
  // console.log(`[API CALL] → ${apiUrl}`); // check api working

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.status === 404 || data.cod === '404') {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌦️ Weather app running at http://localhost:${PORT}`);
});
