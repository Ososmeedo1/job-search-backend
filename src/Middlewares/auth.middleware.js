import User from "../../DB/Models/user.model.js";
import jwt from 'jsonwebtoken';

export const auth = (roles = []) => {
  return async (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
      return res.json("Not logged in");
    }

    if (!token.startsWith) {
      return res.json("Invalid bearer key")
    }

    const originalToken = token.split(process.env.BEARER_KEY)[1];
    const decode = jwt.verify(originalToken, process.env.TOKEN_SIGNATURE);

    if (!decode.id) {
      return res.json("Invalid payload");
    }

    const user = await User.findById(decode.id).select('-password');
    
    if (!user) {
      return res.json("User not found")
    }

    if (!roles.includes(user.role)) {
      return res.json("User not authorized")
    }
    req.user = user;
    return next();
  }
}