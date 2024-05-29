const jwt = require('jsonwebtoken');
const { bad } = require('../helpers/requests');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select('_id email username first_name last_name isAdmin isRenter isInvestor');
    next();
  } catch (err) {
    return bad(res, 'You must be logged in to access this page');
  }
};

module.exports = requireAuth;
