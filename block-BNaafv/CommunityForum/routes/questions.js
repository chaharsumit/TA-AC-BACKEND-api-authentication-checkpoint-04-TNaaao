const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const slugger = require('slug');
const randomString = require('randomstring');

const router = express.Router();

// create Question

router.post('/', auth.verifyToken, async (req, res, next) => {
  try{
    //let user = User.findById(req.user.userId);
    req.body.author = req.user.userId;
    let question = await Question.create(req.body);
    let populatedQuestion = await Question.findById(question.id).populate('author', "_id username").populate('answers');
    res.status(201).json({ question: populatedQuestion });
  }catch(error){
    next(error);
  }
});

// create Question


// get Question

router.get('/', auth.verifyOptional, async (req, res, next) => {
  try{
    let questions = await Question.find({}).populate('author', "_id username").populate('answers');
    res.status(201).json({ questions: questions });
  }catch(error){
    next(error);
  }
})

// get Question

// update Question

router.put('/:questionId', auth.verifyToken, async (req, res, next) => {
  let id = req.params.questionId;
  try{
    let question = await Question.findById(id);
    if(!question){
      return res.status(400).json({ error: "No Quetion found!!" });
    }else if(req.user.userId === question.author.toString()){
      if(req.body.title){
        req.body.slug = slugger(req.body.title) + randomString.generate(3);
      }
      let updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {new: true}).populate('author', "_id username").populate('answers');
      res.status(201).json({ question: updatedQuestion });
    }else{
      return res.status(400).json('you are not the author of this question!!');
    }
  }catch(error){
    next(error);
  }
});

// update Question

// delete Question

router.delete('/:slug', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try{
    let question = await Question.findOne({ slug });
    if(!question){
      return res.status(400).json({ error: "No Quetion found!!" });
    }else if(req.user.userId === question.author.toString()){
      let deletedQuestion = await Question.findOneAndDelete({ slug });
      let deletedAnswers = await Answer.deleteMany({_id: {$in: deletedQuestion.answers}});
      res.status(201).json({ success: "Question deleted successfully "});
    }else{
      return res.status(400).json('you are not the author of this question!!');
    }
  }catch(error){
    next(error);
  }
})

// delete Question

module.exports = router;