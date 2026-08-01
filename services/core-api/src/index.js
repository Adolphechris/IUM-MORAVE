require('dotenv').config();
const express = require('express');
const { faculties, programs, tracks } = require('./data');
const { authenticate, requireRole } = require('./auth');

const PORT = process.env.PORT || 4002;
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'core-api' });
});

app.get('/faculties', (req, res) => {
  res.json(faculties);
});

app.post('/faculties', authenticate, requireRole('admin'), (req, res) => {
  const { code, name, description } = req.body;
  if (!code || !name) {
    return res.status(400).json({ error: 'code and name are required' });
  }

  const exists = faculties.some((item) => item.code === code);
  if (exists) {
    return res.status(409).json({ error: 'Faculty code already exists' });
  }

  const newFaculty = {
    id: faculties.length + 1,
    code,
    name,
    description: description || ''
  };
  faculties.push(newFaculty);
  res.status(201).json(newFaculty);
});

app.get('/programs', (req, res) => {
  const { level } = req.query;
  const result = level ? programs.filter((program) => program.level === level) : programs;
  res.json(result);
});

app.get('/programs/:id', (req, res) => {
  const program = programs.find((item) => item.id === Number(req.params.id));
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  res.json(program);
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

app.get('/news', (req, res) => {
  res.json([
    { id: 1, title: 'Lancement du portail IUM-MORAVE', summary: 'Le portail institutionnel est en cours de développement.', publishedAt: '2026-08-01' }
  ]);
});

app.get('/documents', (req, res) => {
  res.json([
    { id: 1, title: 'Règlement intérieur', filePath: '/docs/reglement.pdf' },
    { id: 2, title: 'Guide de l’étudiant', filePath: '/docs/guide-etudiant.pdf' }
  ]);
});

app.post('/verification/diploma', (req, res) => {
  const { diploma_number, qr_code } = req.body;
  if (!diploma_number && !qr_code) {
    return res.status(400).json({ error: ' diploma_number or qr_code is required' });
  }

  const valid = diploma_number === 'DIP-2026-0001' || qr_code === 'VALID-DIP-QR-2026';
  res.json({ verified: valid, diploma_number, qr_code, issued_by: 'IUM-MORAVE' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`core-api listening on http://localhost:${PORT}`);
});
