const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");

const isAuthenticated = require("./middlewares/isAuthenticated");
const Offer = require("../models/Offer");

const convertToBase64 = require("../utils/convertToBase64");

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const convertedFile = convertToBase64(req.files.picture);

      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          { marque: req.body.brand },
          { taille: req.body.size },
          { etat: req.body.condition },
          { emplacement: req.body.city },
        ],
        owner: req.user,
      });

      await cloudinary.api
        .create_folder("vinted/offers/" + newOffer.id)
        .then(console.log);

      const result = await cloudinary.uploader.upload(convertedFile, {
        folder: "vinted/offers/" + newOffer.id,
      });

      newOffer.product_image = result;

      await newOffer.save();

      res.json(newOffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;
    parseInt(priceMin, priceMax);
    const filters = {};
    let tri = "";

    const regExp = new RegExp(title, "i");

    if (sort === "price-asc") {
      tri = "asc";
    } else {
      tri = "desc";
    }

    if (title) {
      filters.product_name = regExp;
    }

    if (priceMin && !priceMax) {
      filters.product_price = { $gte: priceMin };
    } else if (!priceMin && priceMax) {
      filters.product_price = { $gte: 0, $lte: priceMax };
    } else if (priceMin && priceMax) {
      filters.product_price = { $gte: priceMin, $lte: priceMax };
    }

    let skip = 0;

    if (page) {
      skip = (page - 1) * 5;
    }

    const offers = await Offer.find(filters)
      .sort({ product_price: tri })
      .skip(skip)
      .limit(5)
      .populate("owner", "account");

    const count = await Offer.countDocuments(filters);

    res.json({ count: count, offers: offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/offers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const offer = await Offer.findById(id).populate("owner", "account");
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.put("/offer/publish/:id/:name", isAuthenticated, async (req, res) => {
//   try {
//     console.log(req.params.name);
//     const result = await Offer.findById(req.params.id);
//     console.log(result.product_name);
//     result.product_name = req.params.name;
//     await result.save();
//     res.json({ message: "route update" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }); bonus a terminer

module.exports = router;
