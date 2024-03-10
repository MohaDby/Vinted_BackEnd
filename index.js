require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2; // ne pas oublier le v2
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const signupRoutes = require("./routes/signup");
app.use(signupRoutes);

const loginRoutes = require("./routes/login");
app.use(loginRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); // la config pour pouvoir se connecter

app.all("*", (req, res) => {
  res.status(400).json({ message: "cette page n'existe pas" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
