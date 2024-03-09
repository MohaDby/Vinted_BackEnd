const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2; // ne pas oublier le v2

const app = express();
app.use(express.json());

const signupRoutes = require("./routes/signup");
app.use(signupRoutes);

const loginRoutes = require("./routes/login");
app.use(loginRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

mongoose.connect("mongodb://localhost:27017/vinted");

cloudinary.config({
  cloud_name: "dsdxpztux",
  api_key: "811538252972272",
  api_secret: "DpLsjvLmHRzDjJaMqikrm1WW6m8",
}); // la config pour pouvoir se connecter

app.all("*", (req, res) => {
  res.status(400).json({ message: "cette page n'existe pas" });
});

app.listen(3000, () => {
  console.log("Server started");
});
