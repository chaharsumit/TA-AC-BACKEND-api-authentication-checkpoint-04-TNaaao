const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/:username', auth.verifyOptional, async (req, res, next) => {
  let username = req.params.username;
  try{
    let user = await User.findOne({ username });
    if(!user){
      return res.status(400).json({ error: "No user found!!" });
    }else{
      return res.status(201).json({ profile: user.profileJSON() });
    }
  }catch{
    next(error);
  }
});

router.put('/:username', auth.verifyToken, async (req, res, next) => {
  let username = req.params.username;
  try{  
    let user = await User.findOne({ username });
    if(!user){
      res.status(400).json({ error: "User not Found!!" });
    }else if(user.id === req.user.userId){
      if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      let updatedProfile = await User.findOneAndUpdate({ username }, req.body, { new: true });
      console.log(updatedProfile);
      return res.status(201).json({ profile: updatedProfile.profileJSON() });
    }else{
      res.status(400).json({ error: "You don't have access to this account" });
    }
  }catch(error){
    next(error);
  }
});

module.exports = router;