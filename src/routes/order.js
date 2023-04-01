const express = require("express");
const router = express.Router();
const { Orders } = require("../models/Order");
const { OrderItem } = require("../models/OrderItem");
const { Cart } = require("../models/Cart");
const { UserShipping } = require("../models/UserShipping");
const { startSession } = require("mongoose");

router.get("/", (req, res) => {
  res.send("You reached order endpoint");
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
  } = req.body;
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

    console.log(newUserShipping);

    // const cartItems = await Cart.find({ userId });

    // cartItems.forEach(async (item) => {
    //   await OrderItem.create({
    //     orderId: newOrder._id,
    //     productId: item.productId,
    //     quantity: item.quantity,
    //   });
    // });

    // Cart.deleteMany({ userId });
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
