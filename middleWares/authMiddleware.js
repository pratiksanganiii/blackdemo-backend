const jwt = require("jsonwebtoken");
const User = require("../model/User");

const generateToken = (payload) => {
  return `Bearer ${jwt.sign({ id: payload }, process.env.JWT_SECRET)}`;
};

const authUser = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let token = req.headers.authorization.split(" ")[1];
    if (token) {
      const userId = jwt.verify(req.headers.authorization.split(" ")[1]).id;
      const reqUser = await User.findById(userId, {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
      });
      req.user = reqUser;
      next();
    } else {
      res.status(401).json({ error: "Not Authorized." });
    }
  } else {
    res.status(401).json({ error: "Not Authorized." });
  }
};

module.exports = {
  generateToken,
  authUser
};
