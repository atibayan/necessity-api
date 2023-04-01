const express = require("express");
const { UserShipping } = require("../models/UserShipping");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const shipping = await UserShipping.findOne({ userId: req.params.userId });
  console.log(shipping);
  res.send({ shipping });
});

module.exports = router;
