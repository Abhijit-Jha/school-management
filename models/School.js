const db = require('../config/database');

const School = {
  create: async (name, address, latitude, longitude) => {
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    return await db.execute(query, [name, address, latitude, longitude]);
  },

  findAll: async () => {
    const query = 'SELECT * FROM schools';
    const [rows] = await db.execute(query);
    return rows;
  }
};

module.exports = School;