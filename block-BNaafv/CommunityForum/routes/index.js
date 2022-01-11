var express = require('express');
const auth = require('../middlewares/auth');
const Question = require('../models/Question');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tags', auth.verifyOptional, async (req, res, next) => {
  try{
    let tags = await Question.find({}).distinct('tags');
    res.status(201).json({ tags: tags });
  }catch(error){
    next(error);
  }
});

module.exports = router;
