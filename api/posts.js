const express = require('express');
const { requireUser } = require('./utils');
const { createPost, getPostsByTagName, updatePost } = require('../db');
const postsRouter = express.Router();
const apiRouter = express.Router();

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagArr.length) {
        postData.tags = tagArr;
    }
    try {
        const post = await createPost(postData);
        if (post) {
            res.send({post});
        } else {
            res.send(console.error(err))
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags} = req.body;
    const updateFields = {};

    if (tags && tags.length > 0) {
        updateFields.tags = tags.trim().split(/\s+/);
    }
    if (title) {
        updateFields.title = title;
    }
    if (content) {
        updateFields.content = content
    }
    try {
        const originalPost = await getPostsById(postId);
        if (originalPost.author.id === req.user.id) {
            const updatedPost = await updatePost(postId, updateFields)
            res.send({ post: updatedPost })
        } else {
            next({
                name: 'UnauthorizedUserError',
                message: 'Not your post to update'
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
        const post = await getPostById(req.params/postId);

        if (post && post.author.id === req.user.id) {
            const updatedPost = await updatePost(post.id, {active: false});
            res.send({ post: updatedPost });
        } else {
            next(post ? {
                name: "UnauthorizedUserError",
                message: "Not your post to delete"
            } : {
                name: "PostNotFoundError",
                message: "Post is nonexistent"
            })
        }
    } catch ({ name, message }) {
        next ({ name, message })
    }
})