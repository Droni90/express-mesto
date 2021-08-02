const router = require("express").Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getMe,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/me", getMe);
router.patch("/users/me", updateUser);
router.get("/users/:_id", getUser);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
