const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  image: String,
}, { timestamps: true });

userSchema.pre('save', async function(next){
  try{
    if(this.password && this.isModified("password")){
      this.password = await bcrypt.hash(this.password, 10);
      next(error);
    }
  }catch(error){
    return error;
  }
});

userSchema.methods.verifyPassword = async function(password){
  try{
    let result = await bcrypt.compare(password, this.password);
    return result;
  }catch(error){
    return error;
  }
}

userSchema.methods.signToken = async function(){
  let payload = { userId: this.id, email: this.email };
  try{
    let token = await jwt.sign(payload, "thisisasecret");
    return token;
  }catch(error){
    return error;
  }
}

userSchema.methods.userJSON = function(token){
  return {
    token: token,
    email: this.email,
    username: this.username
  }
}

userSchema.methods.profileJSON = function(){
  return{
    name: this.name,
    username: this.username,
    image: this.image,
    bio: this.bio
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;