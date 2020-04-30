import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const deleteNoteById = async (baseUrl, variables, token) => {
  const mutation = {
    query: ` mutation ($id: ID!) {
            deleteNote(id: $id) {
              success
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
