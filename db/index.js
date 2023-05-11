//In general, in our db/index.js file we should provide the utility functions that the rest of our application will use. We will call them from the seed file, but also from our main application file.

//basically, this is where all our helper functions go

const { Client } = require("pg");
// supply the db name and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

module.exports = {
  client,
  getAllUsers,
  createUser,
};

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username 
    FROM users;`
  );
  return rows;
}
async function createUser({ username, password }) {
  try {
    const result = await client.query(
      `
    INSERT INTO users (username, password) VALUES ($1, $2);`,
      ["some_name", "some_password"]
    );

    return result;
  } catch (error) {
    throw error;
  }
}
