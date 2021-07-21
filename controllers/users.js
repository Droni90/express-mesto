const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .orFail(new Error("NotFound"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Ошибка в запросе" });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании" });
      }
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    {
      runValidators: true,
      new: true,
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные при обновлении профиля" });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      runValidators: true,
      new: true,
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Переданы некорректные данные при обновлении аватара" });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(500).send({ message: "Ошибка на сервере" });
    });
};
