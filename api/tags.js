const express = require('express');
const { getPostsByTagName } = require('../db');
const tagsRouter = express.Router();
const apiRouter = express.Router();

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const nametag = await getPostsByTagName(post)
    try {
        
    } catch ({ name, message }) {
        next({name, message})
    }
})