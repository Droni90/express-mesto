const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require("../controllers/cards");
const regExp = require("../regexp/regexp");

router.get("/cards", getCards);
router.post("/cards", createCard, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(regExp),
  }),
}), createCard);
router.delete("/cards/:_id", celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteCard);
router.put("/cards/:_id/likes", celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), likeCard);
router.delete("/cards/:_id/likes", celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports = router;
