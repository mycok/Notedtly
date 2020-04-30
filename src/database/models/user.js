import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    index: { unique: true },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
  },
  avatar: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: [{
    type: Schema.ObjectId,
    ref: 'Note',
  }],
  favorites: [{
    type: Schema.ObjectId,
    ref: 'Note',
  }],
}, { timestamps: true });

export const User = model('User', UserSchema);
