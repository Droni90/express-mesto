const router = require("express").Router();
const { getDirectors, createDirector } = require("../controllers/user");

router.get("/", getDirectors);
router.post("/", createDirector);

module.exports = router;
