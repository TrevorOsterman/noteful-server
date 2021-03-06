const FolderService = {
  getAllFolders(knex) {
    return knex.select("*").from("noteful_folders");
  },

  createFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("noteful_folders")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .select("*")
      .from("noteful_folders")
      .where("id", id)
      .first();
  },

  updateFolder(knex, id, updatedFolder) {
    return knex("noteful_folders")
      .where({ id })
      .update(updatedFolder);
  },

  deleteFolder(knex, id) {
    return knex
      .from("noteful_folders")
      .where({ id })
      .delete();
  }
};

module.exports = FolderService;
