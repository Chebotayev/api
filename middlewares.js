const jwt = require("jsonwebtoken");

const authMiddleware = (ctx, next) => {
  const authorizationHeader = ctx.headers.authorization;

  if (!authorizationHeader) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header is missing" };
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret_key");
    ctx.state.user = decoded;
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
    return;
  }

  return next();
};

module.exports = { authMiddleware };
