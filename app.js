const express = require('express')
const app = express()
const User = require ("./User")

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send(`You've reached the app.`)
})

app.post('/register', async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })
  res.status(201).json({
    status: 'success',
    data : {
      newUser
    }
  })
})

module.exports = app
