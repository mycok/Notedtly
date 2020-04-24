export const Query = {
  notes: async (obj, args, { models }) => {
    const notes = await models.Note.find();
    return notes;
  },
  note: async (obj, { id }, { models }) => {
    const note = await models.Note.findById(id);
    return note;
  },
};
