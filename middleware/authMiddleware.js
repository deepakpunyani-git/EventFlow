const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SecretKey;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });

};

const checkUserType = (allowedUserType) => {
    return (req, res, next) => {
      const user = req.user;
      if (user && user.usertype === allowedUserType) {
        next();
      } else {
        res.status(403).json({ success: false, message: 'Permission denied.' });
      } 
    };
  };
    

module.exports = {verifyToken,checkUserType};
