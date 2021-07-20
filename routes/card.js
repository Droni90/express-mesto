const router = require("express").Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:_id", deleteCard);
router.put("/cards/:_id/likes", likeCard);
router.delete("/cards/:_id/likes", dislikeCard);

module.exports = router;
