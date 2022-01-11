const mongoose = require('mongoose');
const slugger = require('slug');
const randomString = require('randomstring');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String }, 
  description: String,
  tags: [String],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

questionSchema.pre("save", function(next){
  this.slug = slugger(this.title);
  this.slug += randomString.generate(3);
  next();
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;