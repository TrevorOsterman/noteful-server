CREATE TABLE noteful_notes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  folder INTEGER REFERENCES noteful_folders(id) ON DELETE CASCADE NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
