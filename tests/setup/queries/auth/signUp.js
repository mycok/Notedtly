import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const signUp = async (baseUrl, variables) => {
  const mutation = {
    query: ` mutation ($username: String!, $email: String!, $password: String!) {
                signUp(username: $username, email: $email, password: $password)
            }
          `,
    variables,
  };
  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .send(mutation);
};
