const express = require('express');

const projectRouter = require('./routers/project-router');
const actionRouter = require('/routers/action-router');

const server = express();

server.use(express.json());
server.use('./api/projects', projectRouter);
server.use('./api/actions', actionRouter);

server.listen(4000);