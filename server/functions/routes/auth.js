const {
  login,
  setAvatar,
  getAllUsers,
  logOut,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/verify");
const router = require("express").Router();

router.post("/login", login);
router.get("/allusers", getAllUsers);
router.post("/setavatar/:id", verifyToken, setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
