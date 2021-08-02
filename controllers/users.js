const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFound = require("../errors/NotFound");
const BadRequest = require("../errors/BadRequest");
const Conflict = require("../errors/Conflict");
const Unauthorized = require("../errors/Unauthorized");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
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
      if (err.name === "NotFound") {
        next(new NotFound("пользователь с указанным _id не найдена"));
      }
      if (err.name === "CastError") {
        next(new BadRequest("Запрашиваемый пользователь не найден"));
      }
      next(err);
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
    .catch((err) => next(err));
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
        next(err);
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
      next(err);
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
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select("+password")
    .orFail(new Error("IncorrectEmail"))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new Unauthorized("Указан некорректный Email или пароль."));
          } else {
            const token = jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" });
            res.status(201).send({ token });
          }
        });
    })
    .catch((err) => {
      if (err.message === "IncorrectEmail") {
        next(new Unauthorized("Указан некорректный Email или пароль."));
      } else {
        next(err);
      }
    });
};
