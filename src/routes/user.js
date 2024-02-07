import express from "express";
import db from "../db.js";

const userRouter = express.Router();

const getUserById = async (id) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${id} LIMIT 1`);

  return user.rows[0];
};

userRouter.get("/get_users", async (_, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/add_user", async (req, res) => {
  try {
    const insertQuery = `
      INSERT INTO users (name)
      VALUES ($1)
    `;

    await db.query(insertQuery, [req.body.name]);
    res.status(200).send("User added");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

userRouter.put("/update_user/:id", async (req, res) => {
  try {
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

    await db.query(updateQuery, [req.body.name, user.id]);
    res.status(200).send("User updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

userRouter.delete("/delete_user", async (req, res) => {
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

userRouter.get("/get_user/:id", async (req, res) => {
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

export default userRouter;
