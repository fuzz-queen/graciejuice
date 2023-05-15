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
    const result = await client.query(
      `
    INSERT INTO users (username, password, name, location) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING 
    RETURNING *;`,
      [username, password, name, location]
    );

    return result;
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
    const result = await client.query(
      `
          UPDATE users
          SET ${setString}
          WHERE id=$${Object.keys(fields).length + 1}
          RETURNING *;
        `,
      [...Object.values(fields), id]
    );

    return result;
  } catch (error) {
    throw error;
  }
}
