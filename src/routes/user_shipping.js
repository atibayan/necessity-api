const express = require("express");
const { UserShipping } = require("../models/UserShipping");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const shipping_createdAt = await UserShipping.findOne({ userId: req.params.userId }).sort({createdAt: "desc"});
  const shipping_updatedAt = await UserShipping.findOne({ userId: req.params.userId }).sort({updatedAt: "desc"});
  if(shipping_createdAt.createdAt > shipping_updatedAt.updatedAt)
    res.send({ shipping: shipping_createdAt });
  else
    res.send({ shipping: shipping_updatedAt });
});

module.exports = router;
