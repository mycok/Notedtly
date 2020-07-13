// TODO:
// - add username validation for the user query
// - throw a database error if a user matching the provided username doesn't exist
// - add pagination for users query

export const userTypeResolvers = {
  notes: async (user, args, { models }) => {
    const notesList = await models.Note.find({ author: user._id }).sort({ _id: -1 });
    return notesList;
  },
  favorites: async (user, args, { models }) => {
    const favoriteList = await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
    return favoriteList;
  },
};

export const userQueries = {
  me: async (obj, args, { user }) => user,
  // this query is supposed to be used for search and filter
  user: async (obj, { username }, { models }) => {
    const user = await models.User.findOne({ username });

    return user;
  },
  users: async (obj, args, { models }) => {
    const users = await models.User.find({}).limit(10);

    return users;
  },
};
