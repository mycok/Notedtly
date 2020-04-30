import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const fetchAllUsers = async (baseUrl) => {
  const query = {
    query: ` query {
            users {
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
    .send(query);
};
