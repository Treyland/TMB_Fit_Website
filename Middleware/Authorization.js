const jwt = require('jsonwebtoken');
require('dotenv').config();

//Authorization Middleware
/* module.exports = async (req, res, next) => {
  try{
    const jwtToken = req.header("Authorization");

    if(!jwtToken) {
      return res.status(403).json("Not Authorize");
    }

    const payload = jwt.verify(jwtToken, process.env.SECRET_KEY);
    req.user = payload.user;
  } catch (err) {
    console.error(err.message)
    return res.status(403).json("Not Authorize");
  }
  next();
}; */

module.exports = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) {
        res.redirect('/login');
        //return res.sendStatus(403);
    } else {
    try { 
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      res.user = payload.user;
      //console.log(res.user);
      return next();
    } catch {
        res.redirect('/login');
        //return res.sendStatus(403);
    }}
};