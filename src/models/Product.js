const mongoose = require('mongoose')

const tagsSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  tag_name: { type: String, required: true }
})
const photosSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  image_name: { type: String, required: true }
})

const productsSchema = new mongoose.Schema({
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

const Products = mongoose.model('Products', productsSchema)
const Tags = mongoose.model('Tags', tagsSchema)
const Photos = mongoose.model('Photos', photosSchema)

module.exports = {
  Products,
  Tags,
  Photos
}