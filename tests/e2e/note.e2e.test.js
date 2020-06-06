import mongoose from 'mongoose';
import JWT from 'jsonwebtoken';

import {
  expect, should, chaiWithHttp, seedNotes,
} from '../setup';
import { app } from '../../src/server';

import { fetchAllNotes } from '../setup/queries/note/notes';
import { createNote } from '../setup/queries/note/newNote';
import { fetchNoteById } from '../setup/queries/note/note';
import { fetchNotesByAuthor } from '../setup/queries/note/notesByAuthor';
import { updateNoteById } from '../setup/queries/note/updateNote';
import { deleteNoteById } from '../setup/queries/note/deleteNote';
import { noteFeed } from '../setup/queries/note/noteFeed';
import { toggleFavorite } from '../setup/queries/note/favorite';

const baseUrl = '/api';

describe('Note CRUD', () => {
  const db = mongoose.connection;
  let noteId;
  let user;
  before(async () => {
    const newUser = await db.models.User.create({
      username: 'test-user',
      email: 'test@now.com',
      password: 'testPass#4',
    });
    const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    user = { ...newUser._doc, token };
  });

  after(async () => {
    await Promise.all([
      db.models.User.deleteMany({}),
      db.models.Note.deleteMany({}),
    ]);
  });

  context('when a user sends a query to fetch all notes', () => {
    it('should return an empty array when there are no notes available', async () => {
      const res = await fetchAllNotes(baseUrl);

      should.exist(res);
      res.should.be.an('object');
      res.body.should.have.property('data');
      res.body.data.should.have.property('notes');
      expect(res.body.data.notes).to.be.an('array');
    });
  });

  context('when a user sends a newNote mutation with the required params', () => {
    it('should create and return a new note', async () => {
      const res = await createNote(baseUrl,
        {
          content: 'testing successful note creation',
        },
        user.token);

      noteId = res.body.data.newNote.id;
      expect(res.body.data.newNote.content).to.be.equal('testing successful note creation');
    });
  });

  context('when a user tries to create a new note without first logging in', () => {
    it('should throw an AuthenticationError', async () => {
      const mutation = {
        query: `mutation ($content: String!) {
                        newNote(content: $content){
                            id
                            content
                        }
                  }`,
        variables: {
          content: 'testing successful note creation',
        }
        ,
      };

      const res = await chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(mutation);

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('You need to login');
    });
  });

  context('when a user sends a newNote mutation with an invalid content property length', () => {
    it('should throw an ApolloError', async () => {
      const res = await createNote(baseUrl,
        {
          content: 'te',
        },
        user.token);

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Path `content` (`te`) is shorter than the minimum allowed length (3).');
    });
  });

  context('when a user sends a newNote mutation with an invalid token', () => {
    it('should throw an AuthenticationError', async () => {
      const token = `${user.token}ty`;
      const res = await createNote(baseUrl,
        {
          content: 'testing successful note creation',
        },
        token);

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Context creation failed: Invalid / Expired token, please login');
    });
  });

  context('when a user sends a query to fetch all notes', () => {
    it('should return an array of notes', async () => {
      const res = await fetchAllNotes(baseUrl);

      res.body.should.have.property('data');
      res.body.data.should.have.property('notes');
      expect(res.body.data.notes).to.be.an('array');
      expect(res.body.data.notes.length).to.be.equal(1);
    });
  });

  context('when a user sends a note query with a noteId param to fetch a single note', () => {
    it('should return a specific note matching the provided id ', async () => {
      const res = await fetchNoteById(baseUrl, {
        id: noteId,
      }, user.token);

      expect(res.body.data.note.id).to.be.equal(noteId);
    });
  });

  context('when a user sends a note query with a non existant noteId param to fetch a single note', () => {
    it('should return null ', async () => {
      const res = await fetchNoteById(baseUrl, { id: '5ea2f94fc1497d48a5db9b17' }, user.token);

      expect(res.body.data.note).to.be.equal(null);
    });
  });

  context('when a user sends an updateNote mutation with a noteId and content params to update a single note', () => {
    it('should successfully update and return an updated note matching the provided id ', async () => {
      const content = 'wow!!...i finally managed to test mutations and queries with mocha';
      const res = await updateNoteById(baseUrl, {
        id: noteId,
        content,
      }, user.token);

      expect(res.body.data.updateNote.content).to.be.equal(content);
    });
  });

  context('when a user sends a noteFeed query', () => {
    let cursor;
    it('without the cursor property, should return the latest 10 notes sorted by their ids ', async () => {
      const notes = seedNotes(user._id);
      await db.models.Note.create(...notes);

      const res = await noteFeed(baseUrl, { cursor: '' });
      cursor = res.body.data.noteFeed.cursor;

      expect(res.body.data.noteFeed.notes.length).to.be.equal(10);
      expect(cursor).to.be.equal(
        res.body.data.noteFeed.notes[res.body.data.noteFeed.notes.length - 1].id,
      );
      expect(res.body.data.noteFeed.hasNextPage).to.be.equal(true);
    });

    it('with the cursor property, should return the remaining notes sorted by their ids ', async () => {
      const res = await noteFeed(baseUrl, { cursor });

      expect(res.body.data.noteFeed.notes.length).to.be.equal(3);
      expect(res.body.data.noteFeed.cursor).to.be.equal('done');
      expect(res.body.data.noteFeed.hasNextPage).to.be.equal(false);
    });
  });

  context('when a user sends a request to fetch all notes authored by a user matching the provided id', () => {
    it('he / she should get a response with a list of all matching notes', async () => {
      const res = await fetchNotesByAuthor(baseUrl, { id: user._id }, user.token);

      expect(res.body.data.notesByAuthor.length).to.be.equal(13);
    });
  });

  context('when a user tries to favorite a note', () => {
    let user1;
    before(async () => {
      const newUser = await db.models.User.create({
        username: 'test-user1',
        email: 'test1@now.com',
        password: 'testPass#4',
      });
      const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      user1 = { ...newUser._doc, token };
    });
    it('if its his/ her own note, should throw an ApolloError', async () => {
      const res = await toggleFavorite(baseUrl, { id: noteId }, user.token);

      const response = JSON.parse(res.text);

      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('You cannot favorite your own note');
    });

    it('if not his/her own note, and the note is not already part of his favorites, should successfully favorite the note', async () => {
      const res = await toggleFavorite(baseUrl, { id: noteId }, user1.token);

      expect(res.body.data.toggleFavorite.favoriteCount).to.be.equal(1);
    });

    it('if not his/her own note, and the note is already part of his favorites, should successfully favorite the note', async () => {
      const res = await toggleFavorite(baseUrl, { id: noteId }, user1.token);

      expect(res.body.data.toggleFavorite.favoriteCount).to.be.equal(0);
    });
  });

  context('when a user tries to delete another users note', () => {
    let user2;
    before(async () => {
      const newUser = await db.models.User.create({
        username: 'test-user2',
        email: 'test2@now.com',
        password: 'testPass#4',
      });
      const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      user2 = { ...newUser._doc, token };
    });
    it('should throw a forbiddenError', async () => {
      const res = await deleteNoteById(baseUrl, { id: noteId }, user2.token);

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('You are not authorized to perform this action');
    });
  });

  context('when a user sends a deleteNote mutation with a noteId param to delete a single note', () => {
    it('should successfully delete the note and return true as confirmation ', async () => {
      const res = await deleteNoteById(baseUrl, { id: noteId }, user.token);

      expect(res.body.data.deleteNote.success).to.be.equal(true);
    });
  });

  context('when a user sends a deleteNote mutation with a non-existant noteId param to delete a single note', () => {
    it('should return false to indicate failure to delete ', async () => {
      const res = await deleteNoteById(baseUrl, { id: noteId }, user.token);

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Note matching ID not found');
    });
  });

  context('when a user sends a newNote mutation with a token that resolves to a non existant user', () => {
    before(async () => {
      await db.models.User.deleteOne({ _id: user._id });
    });
    it('should throw an AuthenticationError', async () => {
      const res = await createNote(baseUrl,
        {
          content: 'testing successful note creation',
        },
        user.token);

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Context creation failed: User not found');
    });
  });
});
