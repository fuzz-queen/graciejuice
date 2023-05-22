const express = require('express');
const server = express();
const apiRouter = require('./api');
server.use('/api', apiRouter);
const appRouter = require ('express').Router();

appRouter.use( packageName = require('packageName') );

server.use('/app', require)

