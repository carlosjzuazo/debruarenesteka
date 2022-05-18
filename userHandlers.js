const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPool } = require("./DB/getPool");
const { validateAuth } = require("./tokens/tokener");

async function insertUser(email, password, name) {
  const pool = await getPool();

  console.log(email, password);

  const [{ insertId }] = await pool.query(
    "INSERT INTO usuarios (email, password, name) VALUES (?, ?, ?)",
    [email, password, name]
  );

  return insertId;
}

async function selectUserByEmail(email) {
  const pool = await getPool();

  const [[user]] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);

  return user;
}

async function registerUser(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const userWithSameEmail = await selectUserByEmail(email);

    if (userWithSameEmail) {
      throw new Error("Ya existe una cuenta registrada con dicho email");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const insertId = await insertUser(email, encryptedPassword);

    res.send({
      status: "ok",
      message: "Usuario registrado con éxito",
      data: {
        id: insertId,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const user = await selectUserByEmail(email);

    if (!user) {
      throw new Error("El email o la contraseña son incorrectos");
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
      throw new Error("El email o la contraseña son incorrectos");
    }

    const tokenPayload = {
      id: user.id,
      email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.send({
      status: "ok",
      data: {
        accessToken: token,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { insertUser, selectUserByEmail, registerUser, loginUser };
