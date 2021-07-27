const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { createUser, login } = require("./controllers/users");

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

app.use("/", require("./routes/user"));
app.use("/", require("./routes/card"));

app.post("/signin", login);
app.post("/signup", createUser);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
