const express = require('express');
const usersRouter = express.Router();
const apiRouter = express.Router();

usersRouters.use((req, res, next) => { 

})

usersRouter.get('/', (req, res) => {
    res.send({
        users: []
    });
});

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password ) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and a password"
        });
    }
    try {
        const user = await getUserByUsername(username);
        if (user && user.password === password) {
            res.send({message: "you have logged in"})
        } else {
            next({
                name: 'IncorrectCredentials';
                message: 'Username and password not found'
            });
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = apiRouter;