const router = require("express").Router();
const { createUser, getUsers, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/user/:_id", getUser);
router.post("/user", createUser);

module.exports = router;
