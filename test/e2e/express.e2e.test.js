import { expect, chaiWithHttp } from '../setup';
import { app } from '../../src/server';

const baseUrl = '/';
describe('test initial express server setup', () => {
  context('when a get request is sent to / ', () => {
    it('should return a string response', (done) => {
      chaiWithHttp
        .request(app)
        .get(baseUrl)
        .end((err, res) => {
          expect(res.text).to.equal('We are here!!!!');
          done(err);
        });
    });
  });
});
