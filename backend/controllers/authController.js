const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const shape = (u) => ({ _id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (User.findByEmail(email)) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({ user: shape(user), token: sign(user.id) });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const raw = User.findByEmail(email);
    if (!raw || !(await User.matchPassword(password, raw.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ user: shape(raw), token: sign(raw.id) });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: shape(req.user) });
};
