import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
  content: {
    type: String,
    required: true,
    minLength: 2,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Note = model('Note', NoteSchema);
