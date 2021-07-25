const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 20,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate(value) {
      if (value.includes("password")) {
        throw new Error("Password Cant containt password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

authorSchema.pre("save", async function (next) {
  const author = this;
  if (author.isModified("password")) {
    author.password = await bcrypt.hash(author.password, 8);
  }
  next();
});

authorSchema.statics.findByCredentials = async (email, password) => {
  const author = await Author.findOne({ email });
  if (!author) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, author.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return author;
};

authorSchema.methods.generateToken = async function () {
  const author = this;
  const token = jwt.sign({ _id: author._id.toString() }, "newsapitoken");
  author.tokens = author.tokens.concat({ token });
  await author.save();
  return token;
};

authorSchema.virtual("news", {
  ref: "News",
  localField: "_id",
  foreignField: "owner",
});

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
