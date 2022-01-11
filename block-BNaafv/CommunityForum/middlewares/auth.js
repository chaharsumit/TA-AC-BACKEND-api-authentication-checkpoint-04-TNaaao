const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: async (req, res, next) => {
    let token = req.headers.authorization;
    try{
      if(token){
        let payload = await jwt.verify(token, "thisisasecret");
        req.user = payload;
        req.user.token = token;
        next();
      }else{
        res.status(400).json({ error: "Token required for Login" });
      }
    }catch(error){
      return next(error);
    }
  },
  verifyOptional: async (req, res, next) => {
    let token = req.headers.authorization;
    try{
      if(token){
        let payload = await jwt.verify(token, "thisisasecret");
        req.user = payload;
        req.user.token = token;
        next();
      }else{
        req.user = null;
        next();
      }
    }catch(error){
      next(error);
    }
  }
}