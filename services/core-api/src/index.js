const http = require('http');

const PORT = process.env.PORT || 4002;

const data = {
  faculties: [
    { id: 1, code: 'FST', name: 'Faculté des Sciences et Technologies' }
  ]
};

const requestHandler = (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'core-api' }));
    return;
  }

  if (req.url === '/faculties' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.faculties));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`core-api listening on http://localhost:${PORT}`);
});
