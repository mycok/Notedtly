import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const me = async (baseUrl, token) => {
  const query = {
    query: ` query {
            me {
                id
                username
                email
            }
        }
          `,
  };


  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    .send(query);
};
