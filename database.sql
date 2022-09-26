CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL, 
    email text NOT NULL UNIQUE, 
    password varchar NOT NULL
);

