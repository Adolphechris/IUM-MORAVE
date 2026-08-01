require('dotenv').config();
const express = require('express');
const { faculties, programs, tracks } = require('./data');

const PORT = process.env.PORT || 4002;
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'core-api' });
});

app.get('/faculties', (req, res) => {
  res.json(faculties);
});

app.get('/programs', (req, res) => {
  res.json(programs);
});

app.get('/tracks', (req, res) => {
  res.json(tracks);
});

app.get('/faculty/:id', (req, res) => {
  const faculty = faculties.find((item) => item.id === Number(req.params.id));
  if (!faculty) {
    return res.status(404).json({ error: 'Faculty not found' });
  }
  res.json(faculty);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`core-api listening on http://localhost:${PORT}`);
});
