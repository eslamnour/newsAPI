const express = require("express");
const Author = require("../models/author");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/author", async (req, res) => {
  const author = new Author(req.body);
  try {
    await author.save();
    const token = await author.generateToken();
    res.status(200).send({ author, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/author", auth, (req, res) => {
  Author.find({})
    .then((authors) => {
      res.status(200).send(authors);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

router.get("/author/:id", auth, (req, res) => {
  const _id = req.params.id;
  Author.findById(_id)
    .then((author) => {
      if (!author) {
        return res.status(400).send("Unable to find author");
      }
      res.status(200).send(author);
    })
    .catch((e) => {
      res.status(500).send(e + "Unable to connect to the DataBase");
    });
});

router.patch("/author/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "password", "address"];

  var isValid = updates.every((update) => allowedUpdate.includes(update));
  if (!isValid) {
    return res.status(400).send("Unable to Update");
  }
  const _id = req.params.id;
  try {
    const author = await Author.findById(_id);
    updates.forEach((el) => (author[el] = req.body[el]));
    await author.save();
    if (!author) {
      return res.status(400).send("No User Found");
    }
    res.status(200).send(author);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/author/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const author = await User.findByIdAndDelete(_id);
    if (!author) {
      return res.status(400).send("Unable to find author");
    }
    res.status(200).send(author);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/author/login", async (req, res) => {
  try {
    const author = await Author.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await author.generateToken();
    res.send({ author, token });
  } catch (error) {
    res.status(400).send("Try again" + error);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.author.tokens = req.author.tokens.filter((el) => {
      return el.token != req.token;
    });
    await req.author.save();
    res.send("Logged out Successfully");
  } catch (error) {
    res.status(500).send(error + "Please try again");
  }
});

router.post("/logout-all", auth, async (req, res) => {
  try {
    req.author.tokens = [];
    await req.author.save();
  } catch (error) {
    res.send("error occured ");
  }
});
module.exports = router;
