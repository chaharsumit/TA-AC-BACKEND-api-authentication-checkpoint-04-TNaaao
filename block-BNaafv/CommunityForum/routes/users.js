var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/auth');
var router = express.Router();

/* GET users listing. */

// Register User

router.post('/', async (req, res, next) => {
  try{
    let user = await User.create(req.body);
    let token = await user.signToken();
    return res.status(201).json({ user: user.userJSON(token) });
  }catch(error){
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    res.status(400).json({ error: "Email/Password required" });
  }
  try{
    let user = await User.findOne({ email });
    if(!user){
      res.status(400).json({ error: "No user found!!" });
    }
    let result = await user.verifyPassword(password);
    if(!result){
      res.status(400).json({ error: "Incorrect Password!!" });
    }
    let token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  }catch(error){
    next(error);
  }
});

router.get('/current-user', auth.verifyToken, async (req, res, next) => {
  try{
    let user = await User.findById(req.user.userId);
    res.status(201).json({ profile: user.userJSON(req.user.token) });
  }catch(error){
    next(error);
  }
})

// Register User

module.exports = router;