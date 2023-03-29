const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
    required: true,
  },
  shippingPhone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
    default: "standard"
  },
  billingAddress: {
    type: String,
    default: ""
  },
  billingCountry: {
    type: String,
    default: ""
  },
  billingState: {
    type: String,
    default: ""
  },
  billingPostalCode: {
    type: String,
    default: ""
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
    enum: ['Order Received', 'Shipped', 'Delivered'],
    default: 'Order Received'
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
