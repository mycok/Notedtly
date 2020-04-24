export const Mutation = {
  newNote: async (obj, { content }, { models }) => {
    const newNote = { content, author: 'michael' };
    const note = await models.Note.create(newNote);

    return note;
  },
  updateNote: async (obj, { id, content }, { models }) => {
    const updatedNote = models.Note.findByIdAndUpdate(
      id, { content },
      { new: true, omitUndefined: true },
    );
    return updatedNote;
  },
  deleteNote: async (obj, { id }, { models }) => {
    const deleted = await models.Note.findByIdAndDelete(id);
    if (deleted) return true;
    return false;
  },
};
