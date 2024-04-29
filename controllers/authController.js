const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const EventFlowUser = require('../models/EventFlow-users');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require("nodemailer");

const saltRounds = parseInt(process.env.saltRounds);

const secretKey = process.env.SecretKey;


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { usernameOrEmail, password } = req.body;

    try {
        const user = await EventFlowUser.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ username: user.username, usertype:  user.usertype , _id:user._id }, secretKey, { expiresIn: '1d' });
            res.json({ success: true, token, user: { username: user.username, usertype:  user.usertype } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error checking credentials:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.adminForgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      const admin = await EventFlowUser.findOne({ email: email, usertype: 'admin' });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found with this email' });
      }
      const otp = generateOTP();
      admin.email_otp = otp;
      admin.save();

        const mailOptions = {
            to: email,
            from: 'Deepak <' + process.env.EMAIL_HOST + '>',
            subject: 'OTP Email',
            text: `Your OTP for email verification is: ${otp}`,
            html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`,
        };

         // Create a transporter with AOL SMTP settings
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, 
            secure: false,
            debug: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD 
            }
          });

          // Send email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
          });
  

      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  exports.resetPassword =  async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const user = await EventFlowUser.findOne({ email });

      if (!user || user.email_otp != otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        user.email_otp = '';
  
      await user.save();
  
      return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }