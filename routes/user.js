const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUser, updateUser, updateAvatar, getMe,
} = require("../controllers/users");
const regExp = require("../regexp/regexp");

router.get("/users", getUsers);
router.get("/users/me", getMe);
router.patch("/users/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.get("/users/:_id", celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), getUser);
router.patch("/users/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExp),
  }),
}), updateAvatar);

module.exports = router;
