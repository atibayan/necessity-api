const express = require('express')
const router = express.Router()
const ProductV2 = require ('../models/ProductV2')
const { uploadObject, deleteObject, getObjectSignedUrl } = require('../services/s3')


const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const crypto = require('crypto')
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

router.get('/', async (req, res) => {
  res.send({products: {}})
})

router.post('/', upload.array('image'), async (req, res) => {
  const images = []
  req.files.forEach(async file => {
    const imageName = randomImageName()
    images.push(imageName)
    // uploadObject(imageName, file.buffer, file.mimeType)
  })

  const newProduct = await ProductV2.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    tags: req.body.tags,
    images: images,
    quantity_on_hand: req.body.qtyOnHand
  })

  console.log(newProduct)

  res.status(200).json({
    status: 'success',
    data : {
      newProduct,
      message: `Posted product`
    }
  })
})


router.get('/', async(req, res) => {
  res.send('You reached product endpoint');
})

module.exports = router