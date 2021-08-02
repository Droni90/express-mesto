const jwt = require("jsonwebtoken");
const Unauthorized = require("../errors/Unauthorized");

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return new Unauthorized("Необходима авторизация");
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    return new Unauthorized("Необходима авторизация");
  }

  req.user = payload;

  return next();
};
