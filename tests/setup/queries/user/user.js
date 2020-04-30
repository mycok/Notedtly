import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const fetchUserByUsername = async (baseUrl, variables) => {
  const query = {
    query: ` query ($username: String!) {
            user(username: $username) {
                id
                username
                email
            }
        }
          `,
    variables,
  };


  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .send(query);
};
