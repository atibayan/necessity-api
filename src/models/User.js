const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.statics.findByUserId = function (user_id) {
  return this.where("user_id").equals(user_id);
};

module.exports = mongoose.model("User", userSchema);
