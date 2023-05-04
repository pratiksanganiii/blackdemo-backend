const { getRecentChats } = require("../controllers/chatController");

const router = require("express").Router();

router.get("/getRecentChats/:id", getRecentChats);
module.exports = router;
