const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("./db/mongoose");

app.use(express.json());

const authorRouter = require("./routers/author");
const newsRouter = require("./routers/news");
app.use(authorRouter);
app.use(newsRouter);

app.listen(port, () => {
  console.log(`Listening to ${port} . . . Servcer is Up`);
});
