require('dotenv').config();

const express = require('express');
const cors = require('cors');

const config = require('./config.js');
const { guides } = require('./guides.js');

const {
  startProcess,
  auth,
  getUser,
  updateUser,
  addProperties,
  deleteUser,
  getUserHash,
} = config;

const server = express();

const PORT = process.env.PORT || 8080;

server.use(cors());
server.use(express.json());

const style =
  'border: 1px solid #ddd; border-left: 0.2em solid #f36d33; background: #f4f4f4; margin-left: 1em; padding: 1em;';

server.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <h1>Welcome to Tiny Express Server</h1>
        <p>This is a test server for learning how to work with HTTP requests to RESTful APIs.</p>
        <p>It is recommended to use <a href="https://www.postman.com/downloads/" target="_blank">Postman</a> or similar applications to work with the API.</p>
        <h2>To get started with the API, follow these instructions</h2>
        <div style="${style}">
          <p>Host: ${req.protocol}://${req.headers.host}</p>
          <p>Method: GET</p>
          <p>URL: /api/v1/learn/api/start</p>
        </div>
        <h2>Stuck? Check out the help section</h2>
        <div style="${style}">
          <p>Host: ${req.protocol}://${req.headers.host}</p>
          <p>Method: GET</p>
          <p>URL: /api/v1/learn/api/help</p>
        </div>
        <h2>Attention</h2>
        <p>Your data will be available within one session (about 1 hour). After a server restart, all data is deleted automatically.</p>
      </body>
    </html>
  `);
});

server.get('/api/v1/learn/api/start', (_, res) => {
  res.json(startProcess());
});

server.post('/api/v1/learn/api/auth', async (req, res) => {
  const { login, password } = req?.body;
  const { status, ...response } = await auth(login, password);
  res.status(status).json(response);
});

server.get('/api/v1/learn/api/user/:id', async (req, res) => {
  const { id } = req?.params;
  const { status, ...response } = await getUser(id);
  res.status(status).json(response);
});

server.patch('/api/v1/learn/api/user/:id', async (req, res) => {
  const { id } = req?.params;
  const { name } = req?.body;
  const { status, ...response } = await updateUser(id, name);
  res.status(status).json(response);
});

server.put('/api/v1/learn/api/user/:id', async (req, res) => {
  const { id } = req?.params;
  const { status, ...response } = await addProperties(id, { ...req?.body });
  res.status(status).json(response);
});

server.delete('/api/v1/learn/api/user/:id', async (req, res) => {
  const { id } = req?.params;
  const { authorization } = req?.headers;
  const { status, ...response } = await deleteUser(id, authorization);
  res.status(status).json(response);
});

server.get('/api/v1/learn/api/user/:id/hash', async (req, res) => {
  const { id } = req?.params;
  const { status, ...response } = await getUserHash(id);
  res.status(status).json(response);
});

server.get('/api/v1/learn/api/user/:id/hash', async (req, res) => {
  const { id } = req?.params;
  const { status, ...response } = await getUserHash(id);
  res.status(status).json(response);
});

server.get('/api/v1/learn/api/help', (_, res) => {
  res.json(guides());
});

server.all('/*', (req, res) => {
  res.status(404).json({
    status: 'Error',
    message: `The requested URL [${req.method.toUpperCase()}] ${
      req.url
    } was not found on this server.`,
  });
});

server.listen(PORT);

console.log(`Serving at localhost:${PORT}`);
