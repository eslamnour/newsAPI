const jwt = require("jsonwebtoken");
const Author = require("../models/author");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "newsapitoken");
    const author = await Author.findOne({
      _id: decode._id,
      "tokens.token": token,
    });
    if (!author) {
      throw new Error("Invalid User");
    }
    req.author = author;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "please Authonicate " });
  }
};

module.exports = auth;
