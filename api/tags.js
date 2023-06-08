const express = require('express');
const { 
    getAllTags,
    getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.get('/', async (req, res, next) => {
    try {
        const tags = await getAllTags();
        res.send({tags});
    } catch (error) {
        next(error);
    }
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    let { tagName } = req.params;
    tagName = decodeURIComponent(tagName)
    try {
        const allPosts = await getPostsByTagName(tagName);
        const posts = allPosts.filter(post => {
            if (post.active) {
                return true;
            }
            if (req.user && req.user.id === post.author.id) {
                return true;
            }
            return false;
        })
    } catch (error) {
        next(error)
    }
});

module.exports = tagsRouter;