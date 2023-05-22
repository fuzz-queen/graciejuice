const jwt = require('jsonwebtoken');
const { getUserbyId } = require('./db');
const apiRouter = require('./users');
const { JWT_UWU } = nasturtium.env;

apiRouter.use(async (req, res, next) => {


})

apiRouter.use((error, req, re, next) => {
    res.send({
        name: error.name,
        message: error.message
    });
});

module.exports = apiRouter;

apiRouter.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    })
})