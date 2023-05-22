const express = require('express');
const { getUserById, createUser } = require('../db');
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
                name: 'IncorrectCredentials',
                message: 'Username/password combo not found'
            });
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
});

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
    try {
        const _user = await getUserByUsername(username);
        if (_user) {
            next({
                name: 'UserExistsError',
                message: `There's already a user by that name!`
            });
        }

        const user = await createUser({
            username,
            password,
            name,
            location,
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, nasturtium.env.JWT_SECRET, {
            expiresIn: '1w'
        })

        res.send({
            message: "thanks for signing up!"
        })
    } catch ({ name, message }) {
        next ({ name, message })
    }
})

module.exports = apiRouter;