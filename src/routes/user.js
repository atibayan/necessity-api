const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { checkJwt } = require("../services/check-jwt");
// const { requestManagementToken, getUserInfo } = require('../services/management-api')

const config = require("../configs/config");
const axios = require("axios");

router.get("/:id", async (req, res) => {
  const suerfind = await User.find({ user_id: req.params.id });
  // console.log(suerfind)
  // const token = await requestManagementToken()
  // console.log(token)
  // const users = await getUserInfo(token)
  // console.log(users)
  // console.log("hello")
  res.send("hello");
});

router.post("/", checkJwt, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const { data } = await axios.get(`https://${config.auth.domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { sub, email, nickname, picture, user_role } = data;
  if (sub != req.body.user_id)
    console.log(`Error: Mismatched sub ${sub} and user_id ${req.body.user_id}`);

  let user = {};
  const existingUser = await User.exists({ user_id: sub });

  if (existingUser) {
    user = await User.findById(existingUser._id);
  } else {
    user = await User.create({
      user_id: sub,
      email,
      nickname,
      picture,
      role: user_role,
    });
    console.log(`New user created ${user}`);
  }

  res.send({ user_id: user.user_id, role: user.role });
});

module.exports = router;
