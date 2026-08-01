const http = require('http');

const PORT = process.env.PORT || 4001;

const requestHandler = (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'auth-service' }));
    return;
  }

  if (req.url === '/auth/login' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Login endpoint placeholder' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`auth-service listening on http://localhost:${PORT}`);
});
