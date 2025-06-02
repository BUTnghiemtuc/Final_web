const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: String,
  user: {
    _id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String
  }
});

const photoSchema = new mongoose.Schema({
  file_name: String,
  date_time: String,
  user_id: mongoose.Schema.Types.ObjectId,
  comments: [commentSchema]
});

module.exports = mongoose.model("Photo", photoSchema);
