const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = 'AIzaSyBjniU6kTFkWNyA50AOMuVSPF6IvW3hSnU';

app.get('/optimize', async (req, res) => {
  const pickups = req.query.pickups.split('|');
  const drivers = req.query.drivers.split('|');
  
  // ドライバーとピックアップ地点の距離行列を計算
  const origins = drivers.join('|');
  const destinations = pickups.join('|');
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const distanceMatrix = response.data.rows;

    // 距離マトリックスを基に最適なマッチングを計算するロジック
    const assignments = matchPickupsToDrivers(distanceMatrix);

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function matchPickupsToDrivers(distanceMatrix) {
  const assignments = [];
  const drivers = distanceMatrix.map((row, index) => ({
    index: index,
    distances: row.elements,
  }));

  // 各ドライバーにピックアップ地点を割り当てる
  drivers.forEach(driver => {
    driver.distances.forEach((distance, pickupIndex) => {
      if (!assignments[pickupIndex] || assignments[pickupIndex].distance.value > distance.distance.value) {
        assignments[pickupIndex] = {
          driver: driver.index,
          distance: distance.distance,
          duration: distance.duration,
        };
      }
    });
  });

  return assignments;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
