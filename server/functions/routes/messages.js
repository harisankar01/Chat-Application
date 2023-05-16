const { addMessage, getMessages } = require("../controllers/messageController");
const { verifyToken } = require("../middleware/verify");
const router = require("express").Router();

router.post("/addmsg/", verifyToken, addMessage);
router.post("/getmsg/", verifyToken, getMessages);

module.exports = router;
