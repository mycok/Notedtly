import { app } from '../../../../src/server';
import { chaiWithHttp } from '../..';

export const toggleFavorite = async (baseUrl, variables, token) => {
  const mutation = {
    query: ` mutation ($id: ID!) {
                toggleFavorite(id: $id) {
                    favoriteCount
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
