const express = require('express');
const cors = require('cors');
const School = require('./models/School');

const app = express();
app.use(cors());
app.use(express.json());

// Add School API
app.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    await School.create(name, address, parseFloat(latitude), parseFloat(longitude));
    res.status(201).json({ message: 'School added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Schools API
const calculateDistance = require('./utils/distance');

// Add this endpoint
app.get('/listSchools', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate input parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required parameters: latitude and longitude'
      });
    }

    // Convert to numbers and validate
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        error: 'Invalid coordinates format'
      });
    }

    // Get schools and calculate distances
    const schools = await School.findAll();
    const schoolsWithDistance = schools.map(school => ({
      id: school.id,
      name: school.name,
      address: school.address,
      latitude: school.latitude,
      longitude: school.longitude,
      distance: calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      )
    }));

    // Sort by distance
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    console.error('List schools error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
