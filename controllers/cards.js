const BadRequest = require("../errors/BadRequest");
const Card = require("../models/card");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные при создании карточки"));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Переданы некорректные данные при создании карточки"));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Карточка с указанным _id не найдена"));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные для постановки лайка."));
      }
      next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные для снятии лайка."));
      }
      next(err);
    });
};
