const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { celebrate, Joi } = require("celebrate");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);
app.post("/signin", login);

app.use("/users", auth, require("./routes/user"));
app.use("/cards", auth, require("./routes/card"));

app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
