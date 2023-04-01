const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
    default: "standard",
  },
  datePaid: {
    type: String,
    required: true,
  },
  totalCart: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["Order Received", "Shipped", "Delivered"],
    default: "Order Received",
  },
  isBillingAddressSame: {
    type: Boolean,
    required: true,
  },
});

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = {
  Orders,
};
