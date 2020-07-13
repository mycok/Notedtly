// TODO:
// - add username validation for the user query
// - throw a database error if a user matching the provided username doesn't exist
// - add pagination for users query

export const userQueries = {
  me: async (obj, args, { user }) => {
    const userData = await user
      .populate({ path: 'notes', options: { sort: { _id: -1 } } })
      .populate({ path: 'favorites', options: { sort: { _id: -1 } } })
      .execPopulate();

    return userData;
  },
  // this query is supposed to be used for search and filter
  user: async (obj, { username }, { models }) => {
    const user = await models.User.findOne({ username });

    return user;
  },
  users: async (obj, args, { models }) => {
    const users = await models.User.find({})
      .populate('notes')
      .limit(100);

    return users;
  },
};
