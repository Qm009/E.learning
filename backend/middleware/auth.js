const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(' Auth middleware - Token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.log(' No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    console.log(' Token decoded:', decoded);
    req.user = decoded;
    console.log(' req.user set:', req.user);
    next();
  } catch (err) {
    console.log(' Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(' Access denied - Role not authorized:', req.user.role);
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, roleAuth };