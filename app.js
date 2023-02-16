const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors({
  origin: `http://localhost:3000`
}))

const User = require ("./model/User")


const checkJwt = (req, res, next) => {
  console.log(`I am in checkJwt middleware`)
  const token = req.headers.authorization.split(' ')[1];
  console.log(token)
  next()
}

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', checkJwt, (req, res) => {
  res.send(`You've reached the app.`)
})

app.get("/cart", checkJwt, (req, res) => {
  res.send(`JWT token has been validated.`)
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
