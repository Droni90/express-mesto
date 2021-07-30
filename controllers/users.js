const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFound = require("../errors/NotFound");
const BadRequest = require("../errors/BadRequest");
const Conflict = require("../errors/Conflict");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err.message));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new Error("NotFound"))
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new NotFound("Пользователь не существует"));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Запрашиваемый пользователь не найден"));
      }
      next(err.message);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new NotFound("Пользователь не существует"));
    })
    .catch((err) => next(err.message));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email }).then((usr) => {
    if (usr) {
      next(new Conflict("Пользователь с таким email уже существует"));
    }
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequest("Переданы некорректные данные при создании"));
        }
        next(err.message);
      });
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    {
      runValidators: true,
      new: true,
    })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new NotFound("Пользователь не существует"));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные при обновлении профиля"));
      }
      next(err.message);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      runValidators: true,
      new: true,
    })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new NotFound("Пользователь не существует"));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные при обновлении аватара"));
      }
      next(err.message);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" });
      req.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({
        token: req.cookie.jwt,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Переданы некорректные данные при входе"));
      }
      next(err.message);
    });
};
