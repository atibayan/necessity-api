const express = require('express')
const router = express.Router()
const { Orders } = require ('../models/Order')



router.get("/", (req, res) => {
  res.send('You reached order endpoint')
})

router.post("/", async (req, res) => {
  console.log(req.body)
  const newOrder = await Orders.create(req.body)

  console.log(newOrder)
  await new Promise(r => setTimeout(r, 30000));
  res.status(201).json({
    oid: newOrder._id
  })

})

module.exports = router