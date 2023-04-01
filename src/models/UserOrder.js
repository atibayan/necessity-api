const mongoose = require("mongoose");

const userOrderSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  order_id: { type: String, required: true },
});

const UserOrder = mongoose.model("UserOrder", userOrderSchema);

module.exports = {
  UserOrder,
};
