// 'use strict';

// const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');
// const { BCRYPT_ROUNDS } = require('../config/constants');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       minlength: [2, 'Name must be at least 2 characters'],
//       maxlength: [80, 'Name cannot exceed 80 characters'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: [8, 'Password must be at least 8 characters'],
//       select: false,
//     },
//     avatar: {
//       type: String,
//       default: '',
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'],
//       default: 'user',
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before save
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) {
//     return;
//   }

//   const rounds = Number(process.env.BCRYPT_ROUNDS) || 12;
//   this.password = await bcrypt.hash(this.password, rounds);
// });

// // Compare plain password against stored hash
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Remove sensitive fields from JSON output
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

// module.exports = mongoose.model('User', userSchema);
'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    avatar: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const rounds = Number(process.env.BCRYPT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, rounds);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);