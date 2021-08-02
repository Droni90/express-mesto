const mongoose = require("mongoose");
const { isEmail, isURL, isStrongPassword } = require("validator");

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
      validator: (v) => isURL(v),
      message: "Неккоректный url адрес",
    },
  },
  email: {
    type: String,
    unique: [true, "Пользователь с таким 'email' уже существует."],
    required: [true, "Поле 'email' должно быть заполнено."],
    validate: {
      validator: (v) => isEmail(v),
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
        return isStrongPassword(password,
          {
            minUppercase: false,
            minSymbols: false,
          });
      },
      message: "Ненадежный пароль",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
