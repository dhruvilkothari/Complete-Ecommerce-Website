const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No Token ,  Authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecretKey"));
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
