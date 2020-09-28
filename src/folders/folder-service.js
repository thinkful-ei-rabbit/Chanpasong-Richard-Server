const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('name of folder table here');
  },
  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('name of folder table here')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from('name of folder table here').select('*').where('id', id).first();
  },

  deleteFolder(knex, id) {
    return knex('name of folder table here')
      .where({ id })
      .delete();
  },

  updateFolder(knex, id, newFolderFields) {
    return knex('name of folder table here')
      .where({ id })
      .update(newFolderFields);
  },
};

module.exports = FoldersService;