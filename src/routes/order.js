const express = require("express");
const router = express.Router();
const { Orders } = require("../models/Order");
const { OrderItem } = require("../models/OrderItem");
const { Cart } = require("../models/Cart");
const { UserShipping } = require("../models/UserShipping");
const { startSession } = require("mongoose");

router.get("/", async (req, res) => {
  const orders = [];

  const orderQuery = await Orders.find().sort({  orderStatus : "desc", createdAt: "desc" });

  for (let i = 0; i < orderQuery.length; i++) {
    const orderItem = {};
    const currItem = orderQuery[i];

    orderItem.orderId = currItem._id;
    orderItem.orderDate = currItem.createdAt;
    const oiQuery = await OrderItem.find({ orderId: currItem._id }).select(
      "productId quantity"
    );
    orderItem.orderItems = oiQuery;

    if (currItem.shippingId && currItem.shippingId != "") {
      const usQuery = await UserShipping.findOne({
        _id: currItem.shippingId,
      });
      orderItem.custInfo = usQuery;
    }
    orderItem.shippingMode = currItem.deliveryMethod;
    orderItem.totalPaid = currItem.totalCart;
    orderItem.datePaid = currItem.datePaid;
    orderItem.orderStatus = currItem.orderStatus;

    if (oiQuery.length > 0) orders.push(orderItem);
  }
  res.json({ orders });
});

router.get("/:userId", async (req, res) => {
  const result = [];

  const order_history = await Orders.find({
    userId: req.params.userId,
    orderStatus: { $ne: "Archived" },
  })
    .select("_id createdAt updatedAt totalCart orderStatus shippingId")
    .sort({ createdAt: "desc" });

  for (let i = 0; i < order_history.length; i++) {
    const resultObj = {};
    const item = order_history[i];
    resultObj.oh = item;
    const order_items = await OrderItem.find({ orderId: item._id }).select(
      "productId quantity"
    );
    resultObj.oi = order_items;
    if (item.shippingId) {
      const user_shipping = await UserShipping.findOne({
        _id: item.shippingId,
      }).select("address country state postalCode");
      resultObj.us = user_shipping;
    }
    if (order_items.length != 0) result.push(resultObj);
  }
  res.json({ result });
});

router.post("/archive/:orderId", async (req, res) => {
  const result = await Orders.findOneAndUpdate(
    { _id: req.params.orderId },
    { orderStatus: "Archived" }
  );
  if (!result || result.length == 0) res.status(500).send();
  res.status(204).send();
});

router.patch("/:orderId", async (req, res) => {
  const result = await Orders.findOneAndUpdate(
    { _id: req.params.orderId },
    req.body
  );
  if (!result || result.length == 0) res.status(500).send();
  res.status(204).send();
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

  const session = await startSession();
  try {
    session.startTransaction();

    let shippingId = "";
    const foundUserShipping = await UserShipping.findOneAndUpdate({
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
    }, {firstName});
    console.log(foundUserShipping);
    if (foundUserShipping) {
      shippingId = foundUserShipping._id;
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
      shippingId = newUserShipping._id;
    }

    const newOrder = await Orders.create({
      userId,
      deliveryMethod,
      datePaid,
      totalCart,
      isBillingAddressSame,
      shippingId,
    });

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
