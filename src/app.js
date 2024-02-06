const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());

const getUserById = async (id) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${id} LIMIT 1`);

  return user.rows[0];
};

app.get("/get_users", async (_, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add_user", async (req, res) => {
  const insertQuery = `
    INSERT INTO users (name)
    VALUES ($1)
  `;

  try {
    await db.query(insertQuery, [req.body.name]);
    res.status(200).send("User added");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update_user/:id", async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    res.status(404).send("User not found");

    return;
  }

  const updateQuery = `
    UPDATE users
    SET name = $1
    WHERE id = $2
  `;

  try {
    await db.query(updateQuery, [req.body.name, user.id]);
    res.status(200).send("User updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete_user", async (req, res) => {
  try {
    const user = await getUserById(req.body.id);

    if (!user) {
      res.status(404).send("User not found");

      return;
    }

    await db.query(`DELETE FROM users WHERE id = ${user.id}`);
    res.status(200).send("User deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/get_user/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id, res);

    if (!user) {
      res.status(404).send("User not found");

      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
