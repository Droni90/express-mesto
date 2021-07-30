const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Unauthorized = require("../errors/Unauthorized");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator(url) {
        return /https?:\/\/[\w-]+.[a-z.]+[\/*[a-z#]+]?/gim.test(url);
      },
      message: "Неккоректный url адрес",
    },
  },
  email: {
    type: String,
    unique: [true, "Пользователь с таким 'email' уже существует."],
    required: [true, "Поле 'email' должно быть заполнено."],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Некорректный Email",
    },
  },
  password: {
    type: String,
    minlength: [8, "Минимальная длина поля 'password' - 8 символов."],
    required: [true, "Поле 'password' должно быть заполнено."],
    select: false,
    validate: {
      validator(password) {
        return validator.isStrongPassword(password,
          {
            minUppercase: false,
            minSymbols: false,
          });
      },
      message: "Ненадежный пароль",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password, next) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return next(new Unauthorized("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new Unauthorized("Неправильные почта или пароль"));
          }
          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);
