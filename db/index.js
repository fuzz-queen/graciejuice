//In general, in our db/index.js file we should provide the utility functions that the rest of our application will use. We will call them from the seed file, but also from our main application file.

//basically, this is where all our helper functions go

//imports pg module
const { Client } = require("pg");

// supply the db name and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  createPost,
  getAllPosts,
  updatePost,
  getPostsByUser,
  createTags,
  createPostTag,
  addTagsToPost,
  getPostById,
};

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, password, name, location 
    FROM users;`
  );
  return rows;
}
async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (username, password, name, location) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING 
    RETURNING *;`,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
          UPDATE users
          SET ${setString}
          WHERE id=$${Object.keys(fields).length + 1}
          RETURNING *;
        `,
      [...Object.values(fields), id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
    INSERT INTO posts("authorId", title, content) 
    VALUES($1, $2, $3)
    RETURNING *;
  `,
      [authorId, title, content]
    );
    return post;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [post],
    } = await client.query(
      `
    UPDATE posts
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM posts;
  `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username, name, location, active
        FROM users
        WHERE id=${userId}
      `);

    if (!user) {
      return null;
    }

    user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
        SELECT * 
        FROM posts
        WHERE "authorId"=${userId};
      `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }

  // need something like: $1), ($2), ($3
  const insertValues = tagList.map((_, index) => `$${index + 1}`).join("), (");
  // then we can use: (${ insertValues }) in our string template

  // need something like $1, $2, $3
  const selectValues = tagList.map((_, index) => `$${index + 1}`).join(", ");
  // then we can use (${ selectValues }) in our string template

  try {
    // insert the tags, doing nothing on conflict
    // returning nothing, we'll query after
    const { rows } = await client.query(`
INSERT INTO tags(name)
VALUES ($1), ($2), ($3)
ON CONFLICT (name) DO NOTHING;
SELECT * FROM tags
WHERE name
IN ($1, $2, $3);
`);

    return rows;

    // select all tags where the name is in our taglist
    // return the rows from the query
  } catch (error) {
    throw error;
  }
}

async function createPostTag(postId, tagId) {
  try {
    await client.query(
      `
        INSERT INTO post_tags("postId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("postId", "tagId") DO NOTHING;
      `,
      [postId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

async function addTagsToPost(postId, tagList) {
  try {
    const createPostTagPromises = tagList.map((tag) =>
      createPostTag(postId, tag.id)
    );

    await Promise.all(createPostTagPromises);

    return await getPostById(postId);
  } catch (error) {
    throw error;
  }
}

async function getPostById(postId) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
        SELECT *
        FROM posts
        WHERE id=$1;
      `,
      [postId]
    );

    const { rows: tags } = await client.query(
      `
        SELECT tags.*
        FROM tags
        JOIN post_tags ON tags.id=post_tags."tagId"
        WHERE post_tags."postId"=$1;
      `,
      [postId]
    );

    const {
      rows: [author],
    } = await client.query(
      `
        SELECT id, username, name, location
        FROM users
        WHERE id=$1;
      `,
      [post.authorId]
    );

    post.tags = tags;
    post.author = author;

    delete post.authorId;

    return post;
  } catch (error) {
    throw error;
  }
}
