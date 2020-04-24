import mongoose from 'mongoose';

import { expect, should, chaiWithHttp } from '../setup';
import { app } from '../../src/server';
import { dbConnection, close } from '../../src/database';

const baseUrl = '/api';

describe('test note CRUD', () => {
  const db = mongoose.connection;
  let noteID;
  before(() => {
    dbConnection(`${process.env.MONGODB_URI}`);
  });
  after(async () => {
    await db.dropCollection('notes');
    await close();
  });

  context('when a user sends a query to fetch all notes', () => {
    it('should return an empty array when there are no notes available', (done) => {
      const query = {
        query: `{
            notes {
              id
              content
              author
            }
          }
          `,
      };
      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(query)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.should.be.an('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('notes');
          expect(res.body.data.notes).to.be.an('array');
          done(err);
        });
    });
  });

  context('when a user sends a newNote mutation with the required params', () => {
    it('should create and return a new note', (done) => {
      const mutation = {
        query: `mutation ($content: String!) {
                    newNote(content: $content){
                        id
                        content
                        author
                    }
              }`,
        variables: {
          content: 'note for testing testing',
        }
        ,
      };

      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(mutation)
        .end((err, res) => {
          noteID = res.body.data.newNote.id;
          done(err);
        });
    });
  });

  context('when a user sends a query to fetch all notes', () => {
    it('should return an array of notes', (done) => {
      const query = {
        query: `{
            notes {
              id
              content
              author
            }
          }
          `,
      };
      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(query)
        .end((err, res) => {
          res.body.should.have.property('data');
          res.body.data.should.have.property('notes');
          expect(res.body.data.notes).to.be.an('array');
          expect(res.body.data.notes.length).to.be.equal(1);
          done(err);
        });
    });
  });

  context('when a user sends a note query with a noteId param to fetch a single note', () => {
    it('should return a specific note matching the provided id ', (done) => {
      const query = {
        query: ` query ($id: ID!) {
            note(id: $id) {
                id
                content
                author
            }
        }
          `,
        variables: {
          id: noteID,
        }
        ,
      };

      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(query)
        .end((err, res) => {
          expect(res.body.data.note.id).to.be.equal(noteID);
          done(err);
        });
    });
  });

  context('when a user sends a note query with a non existant noteId param to fetch a single note', () => {
    it('should return null ', (done) => {
      const query = {
        query: ` query ($id: ID!) {
            note(id: $id) {
                id
                content
                author
            }
        }
          `,
        variables: {
          id: '5ea2f94fc1497d48a5db9b17',
        }
        ,
      };

      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(query)
        .end((err, res) => {
          expect(res.body.data.note).to.be.equal(null);
          done(err);
        });
    });
  });

  context('when a user sends an updateNote mutation with a noteId and content params to update a single note', () => {
    it('should successfully update and return an updated note matching the provided id ', (done) => {
      const content = 'wow!!...i finally managed to test mutations and queries with mocha';
      const mutation = {
        query: ` mutation ($id: ID!, $content: String!) {
            updateNote(id: $id, content: $content) {
                id
                content
                author
            }
        }
          `,
        variables: {
          id: noteID,
          content,
        }
        ,
      };

      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(mutation)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.data.updateNote.content).to.be.equal(content);
          done(err);
        });
    });
  });

  context('when a user sends an deleteNote mutation with a noteId param to delete a single note', () => {
    it('should successfully delete and return true as confirmation ', (done) => {
      const mutation = {
        query: ` mutation ($id: ID!) {
            deleteNote(id: $id)
        }
          `,
        variables: {
          id: noteID,
        }
        ,
      };

      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(mutation)
        .end((err, res) => {
          expect(res.body.data.deleteNote).to.be.equal(true);
          done(err);
        });
    });
  });

  context('when a user sends an deleteNote mutation with a non-existant noteId param to delete a single note', () => {
    it('should return false to indicate failure to delete ', (done) => {
      const mutation = {
        query: ` mutation ($id: ID!) {
            deleteNote(id: $id)
        }
          `,
        variables: {
          id: noteID,
        }
        ,
      };

      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(mutation)
        .end((err, res) => {
          expect(res.body.data.deleteNote).to.be.equal(false);
          done(err);
        });
    });
  });
});
