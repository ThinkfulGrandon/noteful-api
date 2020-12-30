CREATE TABLE noteful_notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    content TEXT,
    modified TIMESTAMPTZ DEFAULT now() NOT NULL,
    folderId TEXT NOT NULL
)