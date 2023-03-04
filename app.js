require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const multer = require('multer')
const { S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const crypto = require('crypto')

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

const storage = multer.memoryStorage()
const upload = multer({storage: storage})


const User = require ("./model/User")
const User2 = require ("./model/User2")
const ProductV2 = require ("./model/ProductV2")
const { checkJwt } = require("./check-jwt");
const clientOrigin = process.env.CLIENT_ORIGIN

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: clientOrigin}))

app.get('/',checkJwt, (req, res) => {
  res.send({message: `You've reached the app.`})
})

app.post('/admin/product', upload.array('image'), async (req, res) => {
  console.log(req.body)
  console.log(req.headers)
  const images = []
  req.files.forEach(async file => {
    const imageName = randomImageName()
    images.push(imageName)
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype
    }
    console.log(params)
    // const command = new PutObjectCommand(params)
    // await s3.send(command)
  })

  const newProduct = await ProductV2.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    tags: req.body.tags,
    images: images,
    quantity_on_hand: req.body.qtyOnHand
  })

  res.status(200).json({
    status: 'success',
    data : {
      newProduct,
      message: `Posted product`
    }
  })
})

app.post('/user', checkJwt, (req, res) => {
  const {user_id, email, nickname, picture} = req.body
  let query = User2.find({ email: email, user_id: user_id})
  let user_role = `admin`
  query.count(async (count) => {
    if (count == 0) {
      console.log(`User not found ${email} ${user_id}`)
      const newUser = await User2.create({
        user_id: user_id,
        email: email,
        nickname: nickname,
        picture: picture
      })
      user_role = `admin`
    }
    else
      user_role = `admin`
  }
  )
  res.send({message: `User is received + ${req.body.user_id}`, role: user_role})
})

app.get("/cart", checkJwt, (req, res) => {
  res.send({message: `JWT token has been validated.`})
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


app.post('/register2', async (req, res) => {
  const newUser = await User2.create({
    user_id: req.body.user_id,
    email: req.body.email,
  })
  res.status(201).json({
    status: 'success',
    data : {
      newUser
    }
  })
})


module.exports = app
