const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = {
  OrderItem,
};
