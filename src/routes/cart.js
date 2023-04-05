const express = require("express");
const { Cart } = require("../models/Cart");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("You reached cart endpoint");
});

router.get("/:userId", async (req, res) => {
  const cart = await Cart.find({ userId: req.params.userId });
  const result = [];

  cart.forEach((item) => {
    result.push({ id: item.productId, quantity: item.quantity });
  });
  res.send({ cartItems: result });
});

router.delete("/:userId", (req, res) => {
  const cart = Cart.deleteMany({ userId: req.params.userId });
  res.send({ cart });
});

router.put("/", async (req, res) => {
  const { userId, cartItems } = req.body;

  await Cart.deleteMany({ userId });
  const cids = [];

  cartItems?.forEach(async (item) => {
    const newCartItem = await Cart.create({
      userId,
      productId: item.id,
      quantity: item.quantity,
    });
    cids.push(newCartItem._id);
  });

  res.status(201).json({
    cids,
  });
});

module.exports = router;
