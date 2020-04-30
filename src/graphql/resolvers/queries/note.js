export const noteQueries = {
  notes: async (obj, args, { models }) => {
    const notes = await models.Note.find({})
      .populate('author')
      .populate('favoritedBy')
      .limit(100);
    return notes;
  },
  note: async (obj, { id }, { models }) => {
    const note = await models.Note.findById(id)
      .populate('author')
      .populate('favoritedBy');
    return note;
  },
  noteFeed: async (obj, { cursor }, { models }) => {
    const limit = 10;
    let hasNextPage = false;
    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    // if the cursor is not provided, the query will fetch the latest ten notes
    // sorted by the latest based on _id
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);
    // if the returned notes are greater than the limit
    // slice the notes array to only 10 notes and set the hasNextPage property to true
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }
    // we create a cursor to be used to query more notes
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: hasNextPage ? newCursor : 'done',
      hasNextPage,
    };
  },
};
