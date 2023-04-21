const { compareSync } = require("bcryptjs");
const User = require("../model/User");
const { generateToken } = require("../middlewares/authMiddleware");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && compareSync(password, user.password)) {
      res.json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          _id: user._id,
          token: generateToken(user._id),
        },
        message: "Login Success.",
      });
    } else {
      res.status(400).json({ message: "No user found with that email." });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};
module.exports = {
  login,
  register,
};
