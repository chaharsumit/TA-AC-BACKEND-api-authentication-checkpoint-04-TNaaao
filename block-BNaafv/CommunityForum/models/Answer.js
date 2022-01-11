const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;