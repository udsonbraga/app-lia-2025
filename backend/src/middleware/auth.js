
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Auth header exists:', !!authHeader);
  console.log('Token exists:', !!token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('Verifying token with Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    console.log('Token verification result:');
    console.log('User ID:', user?.id);
    console.log('Error:', error?.message);
    
    if (error || !user) {
      console.log('Token verification failed');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    console.log('Token verified successfully for user:', user.id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
