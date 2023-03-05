const express = require('express')
const router = express.Router()



router.get("/", (req, res) => {
  res.send('You reached cart endpoint')
})

module.exports = router