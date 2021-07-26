CREATE TABLE opening_hours (
   id serial PRIMARY KEY,
   library TEXT NOT NULL,
   day TEXT NOT NULL,
   start TEXT NOT NULL,
   finish TEXT NOT NULL,
   opening_type TEXT NOT NULL, 
   updated TIMESTAMP NOT NULL
);