const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { celebrate, Joi, errors } = require("celebrate");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const NotFound = require("./errors/NotFound");
const errorsHandler = require("./middlewares/errorsHandler");
const regExp = require("./regexp/regexp");

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExp),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use("/", auth, require("./routes/user"));
app.use("/", auth, require("./routes/card"));

app.use("*", (req, res, next) => {
  next(new NotFound("Запрашиваемый ресурс не найден"));
});
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
