import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const fetchNotesByAuthor = async (baseUrl, variables, token) => {
  const query = {
    query: ` query ($id: ID!) {
        notesByAuthor(id: $id) {
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
