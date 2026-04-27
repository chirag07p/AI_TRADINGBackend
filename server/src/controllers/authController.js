const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const Trader = require('../models/Trader');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, investment } = req.body;

  // Check all collections for duplicate email
  const adminExists = await Admin.findOne({ email });
  const customerExists = await Customer.findOne({ email });
  const traderExists = await Trader.findOne({ email });

  if (adminExists || customerExists || traderExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let user;
  if (role === 'Admin') {
    user = await Admin.create({ name, email, password });
  } else if (role === 'Employee') {
    user = await Trader.create({ name, email, password });
  } else {
    user = await Customer.create({ 
      name, 
      email, 
      password, 
      phone,
      portfolioValue: investment ? Number(investment) : 0
    });
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Search across collections
  let user = await Admin.findOne({ email });
  if (!user) user = await Customer.findOne({ email });
  if (!user) user = await Trader.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID, 
  });
  
  const payload = ticket.getPayload();
  const { email, name, sub: googleId } = payload;

  let user = await Admin.findOne({ email });
  if (!user) user = await Trader.findOne({ email });
  if (!user) user = await Customer.findOne({ email });

  if (!user) {
    user = await Customer.create({
      name,
      email,
      googleId,
      role: 'Customer', 
    });
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

module.exports = { registerUser, authUser, googleAuth };
