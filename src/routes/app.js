require("dotenv").config();
const config = require("../configs/config");
const body_parser = require("body-parser");
const express = require("express");
const app = express();
const env = process.env.NODE_ENV;

const cors = require("cors");


const user = require("./user");
const product = require("./product");
const cart = require("./cart");
const wishlist = require("./wishlist");
const order = require("./order");
const user_shipping = require("./user_shipping");

// Middlewares
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

if(env === "dev"){
  const clientOrigin = config.cors.client_origin;
  app.use(cors({ origin: clientOrigin }));
}

app.use("/user", user);
app.use("/product", product);
app.use("/cart", cart);
app.use("/wishlist", wishlist);
app.use("/order", order);
app.use("/user_shipping", user_shipping);

app.get("/", (req, res) => {
  res.send({ message: `You've reached the app.` });
});

module.exports = app;
