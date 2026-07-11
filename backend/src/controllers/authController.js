'use strict';

const User = require('../models/User');
const { signToken } = require('../services/authService');
const { ok, created, badRequest, unauthorized, conflict } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({
    email: normalizedEmail,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email already registered.",
    });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  const token = signToken(user);

  return res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = signToken(user);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  return ok(res, 'User profile fetched.', req.user);
});

// PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return ok(res, 'Profile updated.', user);
});

// PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return badRequest(res, 'Current password is incorrect.');

  user.password = newPassword;
  await user.save();

  return ok(res, 'Password changed successfully.');
});

module.exports = { register, login, getMe, updateProfile, changePassword };
