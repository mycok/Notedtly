import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    index: { unique: true },
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  favoritedBy: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  favoriteCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Note = model('Note', NoteSchema);
