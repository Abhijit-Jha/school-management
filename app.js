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
app.get('/listSchools', async (req, res) => {
  try {
    const schools = await School.findAll();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
