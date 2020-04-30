// TODO:
// - add username validation for the user query
// - throw a database error if a user matching the provided username doesn't exist

export const userQueries = {
  me: (obj, args, { user }) => user,
  user: async (obj, { username }, { models }) => {
    const user = await models.User.findOne({ username })
      .populate('notes')
      .populate('favorites')
      .limit(100);
    return user;
  },
  users: async (obj, args, { models }) => {
    const users = await models.User.find({})
      .populate('notes')
      .populate('favorites');
    return users;
  },
};
