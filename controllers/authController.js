const User = require("../model/User");
const { generateToken } = require("../middleWares/authMiddleware");
const { regex } = require("../config/global");

const login = async (req, res) => {
  const error = [];

  const { email, password } = req.body;

  if (email && !regex.email.test(email)) {
    error.push({
      name: "email",
      errors: ["Email must be a valid email address."],
    });
  } else if (!email) {
    error.push({ name: "email", errors: ["Email is required."] });
  }

  if (password && !regex.password.test(password)) {
    error.push({
      name: "password",
      errors: [
        "Password must contain at-least one special character, uppercase letter,lowercase letter,number and must have at-least 8 characters.",
      ],
    });
  } else if (!password) {
    error.push({ name: "password", errors: ["Password is required."] });
  }
  if (error.length) {
    res.status(400).json({ error });
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        error: [
          {
            name: "email",
            errors: ["No user found with that email address."],
          },
        ],
      });
    } else if (user && user.matchPassword(password)) {
      res.status(200).json({
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
      res.status(400).json({ message: "Invalid credentials." });
    }
  }
};

const register = async (req, res) => {
  const error = [];
  try {
    const { firstName, lastName, email, password } = req.body;

    if (firstName) {
      if (firstName.length < 3) {
        error.push({
          name: "firstName",
          errors: ["First Name must have at-least 3 characters."],
        });
      }
    } else {
      error.push({
        name: "firstName",
        errors: ["First Name is required."],
      });
    }

    if (lastName) {
      if (lastName.length < 3) {
        error.push({
          name: "lastName",
          errors: ["Last Name must have at-least 3 characters."],
        });
      }
    } else {
      error.push({
        name: "lastName",
        errors: ["Last Name is required."],
      });
    }

    if (email) {
      if (!regex.email.test(email)) {
        error.push({
          name: "email",
          errors: ["Email must be a valid email address."],
        });
      }
    } else {
      error.push({
        name: "email",
        errors: ["Email is required."],
      });
    }

    if (password) {
      if (!regex.password.test(password)) {
        error.push({
          name: "password",
          errors: [
            "Password must contain at-least one special character, uppercase letter,lowercase letter,number and must have at-least 8 characters.",
          ],
        });
      }
    } else {
      error.push({
        name: "firstName",
        errors: ["First Name is required."],
      });
    }

    if (error.length) {
      res.status(400).json({ error });
    } else {
      const user = await User.create({ firstName, lastName, email, password });
      res.json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          _id: user._id,
          token: generateToken(user._id),
        },
        message: "Registration Success.",
      });
    }
  } catch (error) {
    res.status(400).json({ error, message: "Something went wrong." });
  }
};
module.exports = {
  login,
  register,
};
