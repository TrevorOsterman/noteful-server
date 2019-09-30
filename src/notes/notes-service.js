const NotesService = {
  getAllNotes(knex) {
    return knex.select("*").from("noteful_notes");
  },
  createNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into("noteful_notes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("noteful_notes")
      .select("*")
      .where("id", id)
      .first();
  },
  getByFolder(knex, id) {
    return knex
      .from("noteful_notes")
      .select("*")
      .where("folder", id);
  },
  deleteNote(knex, id) {
    return knex
      .from("noteful_notes")
      .where({ id })
      .delete();
  }
};

module.exports = NotesService;
