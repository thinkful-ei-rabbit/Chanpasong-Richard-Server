const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('name of note table here');
  },
  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('name of note table here')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from('name of note table here').select('*').where('id', id).first();
  },

  deleteNote(knex, id) {
    return knex('name of note table here')
      .where({ id })
      .delete();
  },

  updateNote(knex, id, newNoteFields) {
    return knex('name of note table here')
      .where({ id })
      .update(newNoteFields);
  },
};

module.exports = NotesService;