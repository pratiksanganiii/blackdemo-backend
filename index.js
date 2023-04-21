const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config({ path: "config/.env" });
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const { corsOpts } = require("./config/cors");

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/", (_req, res) => {
  res.json("Welcome to demo-black api.");
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
