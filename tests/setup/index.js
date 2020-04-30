import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();
const chaiWithHttp = chai.use(chaiHttp);

const seedNotes = (authorId) => {
  const notes = [{
    content: 'test note1',
    author: '',
  },
  {
    content: 'test note2',
    author: '',
  },
  {
    content: 'test note3',
    author: '',
  },
  {
    content: 'test note4',
    author: '',
  },
  {
    content: 'test note5',
    author: '',
  },
  {
    content: 'test note6',
    author: '',
  },
  {
    content: 'test note7',
    author: '',
  },
  {
    content: 'test note8',
    author: '',
  },
  {
    content: 'test note9',
    author: '',
  },
  {
    content: 'test note10',
    author: '',
  },
  {
    content: 'test note11',
    author: '',
  },
  {
    content: 'test note12',
    author: '',
  },
  ];

  return notes.map((note) => {
    note.author = authorId;
    return note;
  });
};

export {
  expect,
  chaiWithHttp,
  should,
  seedNotes,
};
