const { getPool } = require("./DB/getPool");
const { validateAuth } = require("./tokens/tokener");

async function postEntry(req, res, next) {
  try {
    const { title, description, url } = req.body;

    const insertId = await insertEntry(title, description, req.auth.id);

    res.send({
      status: "ok",
      data: {
        id: insertId,
        title,
        description,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function insertEntry(title, description, userId, url) {
  const pool = await getPool();

  const [{ insertId }] = await pool.query(
    "INSERT INTO posts (title, description, id_user, url) VALUES (?, ?, ?, ?)",
    [title, description, userId, url]
  );

  return insertId;
}

async function selectEntries() {
  const pool = await getPool();

  const [entries] = await pool.query(
    "SELECT p.*, u.email FROM posts p LEFT JOIN users u ON p.id_user = u.id"
  );

  return entries;
}

async function getEntries(req, res, next) {
  try {
    const entries = await selectEntries();

    res.send(entries);
  } catch (error) {
    next(error);
  }
}

module.exports = { postEntry, insertEntry };
