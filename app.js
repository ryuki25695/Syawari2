const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = 'AIzaSyBjniU6kTFkWNyA50AOMuVSPF6IvW3hSnU';

// Geocoding APIを使って住所から緯度経度を取得するエンドポイント
app.get('/geocode', async (req, res) => {
  const address = req.query.address;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Distance Matrix APIを使って距離や所要時間を計算するエンドポイント
app.get('/distance', async (req, res) => {
  const origins = req.query.origins;
  const destinations = req.query.destinations;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
