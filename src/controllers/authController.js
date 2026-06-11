import { User } from "../models/index.js";
import jwt from 'jsonwebtoken';


const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}


// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registered successfully ✅',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => e.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email, password); // ← debug

    // check if user exists
    const user = await User.findOne({ where: { email } });
    console.log('User found:', user);  // ← debug

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // check password
    const isMatch = await user.checkPassword(password);
    console.log('Password match:', isMatch);  // ← debug

    if (!isMatch)
      return res.status(401).json({ message: 'Wrong password' });

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful ✅',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.log('Login error:', err.message);  // ← debug
    res.status(500).json({ error: err.message });
  }
};

// GET ME
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};