const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: "60f5e52149570c42b84973da",
  };

  next();
});

app.use("/", require("./routes/user"));
app.use("/", require("./routes/card"));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
