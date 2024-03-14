const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const Signup = require("../models/Signup");

router.post("/user/login", async (req, res) => {
  try {
    const user = await Signup.findOne({ email: req.body.email });

    const hash2 = SHA256(req.body.password + user.salt).toString(encBase64);

    if (hash2 === user.hash) {
      res.json({ _id: user._id, token: user.token, account: user.account });
    } else {
      return res.status(400).json({ message: "mauvais mot de passe" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
