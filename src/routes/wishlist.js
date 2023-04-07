const express = require("express");
const { Wishlist } = require("../models/Wishlist");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("OK")
})

router.get("/:userId", async (req, res) => {
  const wishlist = await Wishlist.find({ userId: req.params.userId }).select("productId");
  const result = []
  for(let i = 0; i < wishlist.length; i++){
    result.push(wishlist[i].productId)
  }
  res.json({wishlist: result});
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
