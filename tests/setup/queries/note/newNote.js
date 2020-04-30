import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const createNote = async (baseUrl, variables, token) => {
  const mutation = {
    query: `mutation ($content: String!) {
                    newNote(content: $content){
                        id
                        content
                    }
              }`,
    variables
    ,
  };

  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    .send(mutation);
};
