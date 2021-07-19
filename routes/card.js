const router = require("express").Router();
const { createCard } = require("../controllers/cards");

router.get("/", getUsers);
router.get("/user:id", getUser);
router.post("/user", createUser);

module.exports = router;