const { Schema, model } = require("mongoose");
const { hashSync } = require("bcryptjs");

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

const User = model("User", userSchema);
module.exports = User;