require('dotenv').config();
const { PORT = 3000 } = process.env;
const express = require('express');
const morgan = require('morgan')
const server = express();
const {client} = require('./db')
client.connect()

server.use(morgan('dev'))
const bodyParser= require('body-parser');
server.use(bodyParser.json())

const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use((req, res, next) => {
    console.log("<___Body Logger START___>");
    console.log(req.body);
    console.log("<___Body Logger END___>");
});

server.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`);
})

