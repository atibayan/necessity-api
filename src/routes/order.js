const express = require("express");
const router = express.Router();
const { Orders } = require("../models/Order");
const { OrderItem } = require("../models/OrderItem");
const { Cart } = require("../models/Cart");
const { UserShipping } = require("../models/UserShipping");
const { startSession } = require("mongoose");

router.get("/:userId", async (req, res) => {
  const result = [];

  const order_history = await Orders.find({ userId: req.params.userId }).select(
    "_id createdAt totalCart orderStatus"
  );

  for (let i = 0; i < order_history.length; i++) {
    const item = order_history[i];
    const order_items = await OrderItem.find({ orderId: item._id }).select(
      "productId quantity"
    );
    if (order_items.length != 0) result.push({ oh: item, oi: order_items });
  }
  res.json({ result });
});

router.post("/", async (req, res) => {
  const {
    userId,
    deliveryMethod,
    datePaid,
    totalCart,
    isBillingAddressSame,

    firstName,
    lastName,
    address,
    country,
    state,
    postalCode,
    shippingPhone,
    email,
    billingAddress,
    billingCountry,
    billingState,
    billingPostalCode,
    cartItems,
  } = req.body;
  console.log(req.body);
  const session = await startSession();

  try {
    session.startTransaction();

    const newOrder = await Orders.create({
      userId,
      deliveryMethod,
      datePaid,
      totalCart,
      isBillingAddressSame,
    });

    const foundUserShipping = await UserShipping.findOne({ userId });
    if (foundUserShipping.length != 0) {
      const updatedShipping = await foundUserShipping.updateOne({
        firstName,
        lastName,
        address,
        country,
        state,
        postalCode,
        shippingPhone,
        email,
        billingAddress,
        billingCountry,
        billingState,
        billingPostalCode,
      });
      console.log(
        `Updated user shipping and billing information ${foundUserShipping._id}`
      );
    } else {
      const newUserShipping = await UserShipping.create({
        userId,
        firstName,
        lastName,
        address,
        country,
        state,
        postalCode,
        shippingPhone,
        email,
        billingAddress,
        billingCountry,
        billingState,
        billingPostalCode,
      });
      console.log(`New user shipping record created ${newUserShipping._id}`);
    }

    const cart = await Cart.find({ userId });
    if (cart && cart.length == 0) {
      // guest user
      cartItems.forEach(async (item) => {
        const newOrderItem = await OrderItem.create({
          orderId: newOrder._id,
          productId: item.id,
          quantity: item.quantity,
        });
        console.log(`New OrderItem created from cartItem ${newOrderItem._id}`);
      });
    } else {
      cart.forEach(async (item) => {
        const newOrderItem = await OrderItem.create({
          orderId: newOrder._id,
          productId: item.productId,
          quantity: item.quantity,
        });
        console.log(`New OrderItem created ${newOrderItem._id}`);
      });

      const deletedCartItems = await Cart.deleteMany({ userId });
      console.log(`Deleting cart items...`);
      console.log(deletedCartItems);
    }

    await session.commitTransaction();
    session.endSession();

    await new Promise((r) => setTimeout(r, 2000));
    res.status(201).json({
      oid: newOrder._id,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(404).send("Failed to add order");
  }
});

module.exports = router;
