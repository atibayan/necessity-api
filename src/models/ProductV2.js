const mongoose = require('mongoose')

const Tags = new mongoose.Schema({ name: String})

const productV2Schema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: true
  },
  quantity_on_hand: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: false,
    default: 0
  }
})

module.exports = mongoose.model('ProductV2', productV2Schema)