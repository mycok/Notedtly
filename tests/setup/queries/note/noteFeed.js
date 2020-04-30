import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const noteFeed = async (baseUrl, variables) => {
  const query = {
    query: ` query ($cursor: String!){
        noteFeed (cursor: $cursor) {
                notes {
                    id
                    content
                }
                cursor
                hasNextPage
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
