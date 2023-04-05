const express = require("express");
const { Wishlist } = require("../models/Wishlist");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("OK")
})

router.get("/:userId", async (req, res) => {
  const wishlist = await Wishlist.find({ userId: req.params.userId }).select("productId");
  res.json({wishlist});
});

router.put("/", async (req, res) => {
  const { userId, wishlistItems } = req.body;

  await Wishlist.deleteMany({ userId });
  wishlistItems.forEach(async (item) => {
    await Wishlist.create({
      userId,
      productId: item,
    });
  });
  res.status(201).send()
});

module.exports = router;
