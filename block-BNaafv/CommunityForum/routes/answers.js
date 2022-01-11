const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const slugger = require('slug');
const randomString = require('randomstring');

const router = express.Router();

// update answers

router.put('/:answerId', auth.verifyToken, async(req, res, next) => {
  let id = req.params.answerId;
  try{
    let answer = await Answer.findById(id);
    if(!answer){
      return res.status(400).json({ error: "No Answer Found!!" });
    }else if(req.user.userId === answer.author.toString()){
      let updatedAnswer = await Answer.findByIdAndUpdate(id, req.body, {new: true}).populate('author', "_id username");
      res.status(201).json({ answer: updatedAnswer });
    }else{
      res.status(400).json({ error: "You are not the owner of this answer" });
    }
  }catch(error){
    next(error);
  }
});

// update answers


// delete answers

router.delete('/:answersId', auth.verifyToken, async (req, res, next) => {
  let id = req.params.answersId;
  try{
    let answer = await Answer.findById(id);
    if(!answer){
      return res.status(400).json({ error: "No Answer Found!!" });
    }else if(req.user.userId === answer.author.toString()){
      let updatedAnswer = await Answer.findByIdAndDelete(id).populate('author', "_id username");
      let updatedQuestion = await Question.findOneAndUpdate({ answers: {$in: updatedAnswer.id} }, {$pull: {answers: updatedAnswer.id}}, {new: true});
      console.log(updatedQuestion);
      res.status(201).json({ answer: updatedAnswer });
    }else{
      res.status(400).json({ error: "You are not the owner of this answer" });
    }
  }catch(error){
    next(error);
  }
})

// delete answers

module.exports = router;