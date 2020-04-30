import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const fetchNoteById = async (baseUrl, variables, token) => {
  const query = {
    query: ` query ($id: ID!) {
            note(id: $id) {
                id
                content
                author {
                  username
                }
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
    .send(query);
};
