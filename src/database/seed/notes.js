import mongoose from 'mongoose';
import logger from '../../utils/logger';

const faker = require('faker');
const fetch = require('node-fetch');

export const seedNotes = async (users) => {
  logger.info('.....seeding notes.......');

  let content;
  const response = await fetch('https://jaspervdj.be/lorem-markdownum/markdown.txt');

  if (response.ok) {
    content = await response.text();
  } else {
    content = faker.lorem.paragraph();
  }

  const notes = [];

  for (let index = 0; index < 25; index += 1) {
    const random = Math.floor(Math.random() * users.length);
    const note = {
      content,
      favoriteCount: 0,
      favoritedBy: [],
      author: mongoose.Types.ObjectId(users[random]._id),
    };
    notes.push(note);
  }

  return notes;
};
