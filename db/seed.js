const { client, getAllUsers, createUser, updateUser } = require("./index");

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "al",
      location: "Sidney, Australia",
    });

    const sandra = await createUser({
      username: "sandra",
      password: "sandra99",
      name: "just sandra",
      location: "Ain't tellin'",
    });

    const glamgal = await createUser({
      username: "glamgal",
      password: "glam99",
      name: "joshua",
      location: "Upper East Side",
    });

    console.log(albert);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS users;
      `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function testDB() {
  try {
    // connect the client to the database, finally
    console.log("Starting to test database...");

    // queries are promises, so we can await them
    const users = await getAllUsers();
    console.log("getAllUsers:", users);
    console.log(users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      username: "Newname Sogood",
      password: "Lesterville, KY",
      name: "new name idk",
      location: "new",
    });
    console.log("Result:", updateUserResult);

    console.log("Finished database tests!");
    // for now, logging is a fine way to see what's up
  } catch (error) {
    console.error("Error testing database");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
