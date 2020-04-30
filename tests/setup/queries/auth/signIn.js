import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const signIn = async (baseUrl, variables) => {
  const mutation = {
    query: ` mutation ($email: String!, $password: String!) {
                signIn(email: $email, password: $password) {
                    user {
                        email
                    }
                    token
                }
            }
          `,
    variables,
  };
  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .send(mutation);
};
