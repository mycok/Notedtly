import assert from 'assert';
import { expect, should, chaiWithHttp } from '../setup';
import { app } from '../../src/server';

const baseUrl = '/api';

describe('test initial graphql server setup', () => {
  context('when a get request is sent to /api ', () => {
    it('should return a string response', (done) => {
      const json = {
        operationName: null,
        query: 'query { hello }',
        variables: {},
      };
      chaiWithHttp
        .request(app)
        .post(baseUrl)
        .send(json)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          expect(res.statusCode).to.be.equal(200);
          res.should.be.an('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('hello');
          assert.equal(res.body.data.hello, 'hello there!!');
          done(err);
        });
    });
  });
});
