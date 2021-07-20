const router = require("express").Router();
const {
  createUser, getUsers, getUser, updateUser, updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/user/:_id", getUser);
router.post("/users", createUser);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
