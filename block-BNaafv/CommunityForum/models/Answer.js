const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

answerSchema.methods.answerJSON = function(questionId){
  return {
    _id: this.id,
    text: this.text,
    questionId: questionId
  }
};

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;