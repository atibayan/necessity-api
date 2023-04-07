const mongoose = require("mongoose");

const userShippingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
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
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
    default: "",
  },
  billingCountry: {
    type: String,
    default: "",
  },
  billingState: {
    type: String,
    default: "",
  },
  billingPostalCode: {
    type: String,
    default: "",
  },
},
  { timestamps: true });

const UserShipping = mongoose.model("UserShipping", userShippingSchema);

module.exports = {
  UserShipping,
};
