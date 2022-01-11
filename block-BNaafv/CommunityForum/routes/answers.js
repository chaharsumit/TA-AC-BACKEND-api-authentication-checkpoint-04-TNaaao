const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const slugger = require('slug');
const randomString = require('randomstring');
const { route } = require('.');

const router = express.Router();

// create Answer

router.post('/', auth.verifyToken, async (req, res, next) => {
  
})

// create Answer


module.exports = router;