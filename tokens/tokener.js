const jwt = require("jsonwebtoken");

async function validateAuth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Necesita el Header de la autenticación");
    }

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer" || !token) {
      throw new Error("El token debe ir en el formato correcto");
    }

    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = tokenPayload;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validateAuth };
