const UserRole = require("../model/UserRole");

const userRoleValidator = async (role) => {
  return !!(await UserRole.findOne({ id: role }));
};

module.exports = {
  userRoleValidator,
};
