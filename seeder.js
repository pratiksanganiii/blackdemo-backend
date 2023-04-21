require("dotenv").config({ path: "./config/.env" });
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/db");
const UserRole = require("./model/UserRole");

const userRolesList = [
  { id: 1, role: "Owner" },
  { id: 2, role: "Customer" },
  { id: 3, role: "Super Admin" },
];
async function seeder() {
  try {
    await connectDB();
    await UserRole.collection.deleteMany({});
    userRolesList.map(async (userRole) => {
      const role = await UserRole(userRole);
      await role.save();
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seeder();
