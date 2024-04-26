const { validationResult } = require('express-validator');
const User = require('../models/EventFlow-users');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const saltRounds = parseInt(process.env.saltRounds);

const isDuplicate = async (field, value) => {
  const existingUser = await User.findOne({ [field]: value });
  return existingUser !== null;
};

const createStaff = async (req, res) => {
  try {
    const { firstname, lastname, username, jobRole, password } = req.body;
    const createdBy = req.user ? req.user._id : null;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (await isDuplicate('username', username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newStaff = await User.create({
      firstname,
      lastname,
      username,
      jobRole,
      usertype: 'staff',
      password:hashedPassword,
      createdBy,
    });

    return res.status(201).json(newStaff);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { firstname, lastname, username, email, jobRole, password } = req.body;
    const createdBy = req.user ? req.user._id : null;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    if (await isDuplicate('username', username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (await isDuplicate('email', email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = await User.create({
      firstname,
      lastname,
      username,
      email,
      jobRole,
      usertype: 'admin',
      password:hashedPassword,
      createdBy,
    });

    return res.status(201).json(newAdmin);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const { name, usertype, status  , sortby , sort} = req.query;

    if(sortby ==''){
      sortby = 'firstname';
    }


    const filters = {};
    if (name) {
      filters.$or = [
        { firstname: { $regex: name, $options: 'i' } },
        { lastname: { $regex: name, $options: 'i' } },
      ];
    }
    if (usertype) {
      filters.usertype = usertype;
    }
    if (['active', 'inactive'].includes(status)) {
      filters.status = status
    }


    const users = await User.find(filters).select('firstname lastname username email jobRole usertype status').sort({ [sortby]: sort === 'asc' ? 1 : -1 }).populate('updatedBy', ['firstname', 'lastname']).populate('createdBy', ['firstname', 'lastname']);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Update staff member's password by admin
const updateStaffPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedStaff = await User.findByIdAndUpdate(
      { _id: id, usertype: 'staff' },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    return res.json(updatedStaff);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, jobRole } = req.body;
    const updatedBy = req.user ? req.user._id : null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const updatedStaff = await User.findOneAndUpdate(
        { _id: id, usertype: 'staff' },
        { $set: { firstname, lastname, jobRole ,updatedBy } },
        { new: true }
      );


    if (!updatedStaff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    return res.json(updatedStaff);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Update the profile of the currently logged-in user
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user

    const { firstname, lastname, email, jobRole } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { firstname, lastname, email, jobRole } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('firstname lastname username email jobRole usertype status').populate('updatedBy', ['firstname', 'lastname']).populate('createdBy', ['firstname', 'lastname']);
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateLoggedInUserPassword = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { currentPassword, newPassword } = req.body; 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(userId);
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createStaff,
  createAdmin,
  listUsers,
  updateStaffPassword,
  updateStaff,
  updateProfile,
  getUser,
  updateLoggedInUserPassword
};
