import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (userId) => jwt.sign(
  { userId },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: cleanName, email: cleanEmail, password: hashedPassword });
    const token = createToken(user._id.toString());

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: publicUser(user)
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Unable to register user. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = createToken(user._id.toString());
    return res.json({
      message: 'Login successful.',
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Unable to log in. Please try again.' });
  }
};
