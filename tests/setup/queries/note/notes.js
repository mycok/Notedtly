import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const fetchAllNotes = async (baseUrl) => {
  const query = {
    query: `{
            notes {
              id
              content
            }
          }
          `,
  };

  return chaiWithHttp
    .request(app)
    .post(baseUrl)
    .send(query);
};
