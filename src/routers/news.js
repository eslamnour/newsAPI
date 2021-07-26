const express = require("express");
const News = require("../models/news");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/news", auth, async (req, res) => {
  const news = new News({ ...req.body, owner: req.author._id });
  try {
    await news.save();
    res.status(201).send(news);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/news", auth, async (req, res) => {
  try {
    await req.author.populate("news").execPopulate();
    res.send(req.author.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/news/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const news = await News.findOne({ _id, owner: req.user._id });
    if (!news) {
      return res.status(400).send("No Task found");
    }
    res.send(news);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/news/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["description"];

  var isValid = updates.every((update) => allowedUpdate.includes(update));
  if (!isValid) {
    return res.status(400).send("Unable to Update");
  }
  const _id = req.params.id;
  try {
    const news = await News.findOne({ _id, owner: req.user._id });
    updates.forEach((el) => (task[el] = req.body[el]));
    await news.save();
    if (!news) {
      return res.status(400).send("No task Found");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/news/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const news = await News.findOneAndDelete({ _id, owner: req.user._id });
    if (!news) {
      return res.status(400).send("Unable to find user");
    }
    res.status(200).send(news);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
