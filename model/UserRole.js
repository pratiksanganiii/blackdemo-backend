const { Schema, model } = require("mongoose");

const userRoleSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});
const UserRole = model("UserRole", userRoleSchema);
module.exports = UserRole;
