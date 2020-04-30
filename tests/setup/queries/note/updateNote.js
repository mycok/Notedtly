import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const updateNoteById = async (baseUrl, variables, token) => {
  const mutation = {
    query: ` mutation ($id: ID!, $content: String!) {
            updateNote(id: $id, content: $content) {
                id
                content
            }
        }
          `,
    variables,
  };

  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    .send(mutation);
};
