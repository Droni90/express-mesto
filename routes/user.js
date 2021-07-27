const router = require("express").Router();
const {
  createUser, getUsers, getUser, updateUser, updateAvatar, getMe,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:_id", getUser);
router.get("/users/me", getMe);
router.post("/users", createUser);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
