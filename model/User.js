const { Schema, model } = require("mongoose");
const { hashSync, compareSync } = require("bcryptjs");
const { userRoleValidator } = require("../config/validators");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      default: 2,
      validate: userRoleValidator,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let userDoc = this;
  userDoc.password = hashSync(userDoc.password);
  next();
});

userSchema.methods.matchPassword = function (password) {
  return compareSync(password, this.password);
};

const User = model("User", userSchema);
module.exports = User;
