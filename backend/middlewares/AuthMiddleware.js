// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authProtect = async (req, res, next) => {
  let token;

  // 1) Read Authorization header if present: "Bearer <token>"
  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) Optional fallback to cookie (uncomment if you use cookie-parser)
  // if (!token && req.cookies && req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // 3) If no token found, deny access
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 4) Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should be the payload you set when signing (commonly { id: user._id, iat, exp })

    // 5) Find the user in DB and attach to req (omit password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user; // now downstream handlers can use req.user
    next(); // allow request to continue
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = authProtect;
