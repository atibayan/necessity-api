const config = require('../configs/config')
const express = require('express')
const app = express()

const cors = require('cors')
const clientOrigin = config.cors.client_origin

const user = require('./user')
const product = require('./product')
const cart = require('./cart')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: clientOrigin}))

app.use('/user', user)
app.use('/product', product)
app.use('/cart', cart)

app.get('/', (req, res) => {
  res.send({message: `You've reached the app.`})
})

module.exports = app
