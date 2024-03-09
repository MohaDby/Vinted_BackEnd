const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const Signup = require("../models/Signup");

router.post("/user/signup", async (req, res) => {
  try {
    const existEmail = await Signup.findOne({ email: req.body.email });
    console.log(existEmail);
    if (!existEmail) {
      return res.status(400).json({ message: "l'email existe déja" });
    }
    if (!req.body.username) {
      return res.status(400).json({ message: "username non renseigné" });
    }
    // if ( //   req.body.username !== string ||
    // //   req.body.length < 3)

    const salt = uid2(16);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    const token = uid2(64);

    const newSignup = new Signup({
      account: {
        username: req.body.username,
      },
      email: req.body.email,
      newsletter: req.body.newsletter,
      salt: salt,
      hash: hash,
      token: token,
    });
    await newSignup.save();

    res.status(201).json({
      _id: newSignup._id,
      token: newSignup.token,
      account: newSignup.account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
