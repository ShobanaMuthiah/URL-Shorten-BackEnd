import User from '../Models/User.js'; 
import Token from '../Models/Token.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../Utils/Nodemailer.js';
import {nanoid} from 'nanoid';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const hashpassword=await bcrypt.hash(password,10)
  const user = new User({ email, firstName, lastName, password:hashpassword });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  await new Token({ userId: user._id, token }).save();
  

  const link = `${process.env.CLIENT_URL}/activate/${token}`;
  await sendEmail(user.email, 'Account Activation', `Click the link to activate your account: ${link}`);

  res.status(201).send('Registration successful, please check your email to activate your account.');
};

export const activateAccount = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) return res.status(400).json({message:'Invalid token.'});

  user.isActive = true;
  await user.save();
  
  res.json({message:'Account activated successfully.'});
};

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({message:'User not found.'});
      }
  
      if (!user.isActive) {
        return res.status(400).json({message:'Account not activated.'});
      }
  
      const isMatch = await bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({message:'Invalid password.'});
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({message:'Server error.'});
    }
  };

  export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({message:'User not found.'});
      }
  
      const token = nanoid(20);
      const resetToken = new Token({
        userId: user._id,
        token,
      });
      await resetToken.save();
  
      const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
      await sendEmail(user.email, 'Password Reset', `Click the link to reset your password: ${resetLink}`);
  
      res.status(200).json({message:'Password reset link has been sent to your email.'});
    } catch (err) {
      res.status(500).json({message:'Server error.'});
    }
  };

  export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const resetToken = await Token.findOne({ token });
      if (!resetToken) {
        return res.status(400).send('Invalid or expired token.');
      }
  
      const user = await User.findById(resetToken.userId);
      if (!user) {
        return res.status(400).send('User not found.');
      }
  
      // const salt = await bcrypt.genSalt(10);

     const hashpassword = await bcrypt.hash(password, 10);
      await User.updateOne({token},{password:hashpassword})
      await user.save();
  
      await User.deleteOne({token})
  
      res.send('Password has been reset successfully.');
    } catch (err) {
      res.status(500).send('Server error.');
    }
  };