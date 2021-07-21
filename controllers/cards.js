const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании карточки" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании карточки" });
      }
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Ошибка в запросе" });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }

      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные для постановки лайка." });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные для снятии лайка." });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};
