CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL, 
    email text NOT NULL UNIQUE, 
    password varchar NOT NULL
);

CREATE TABLE programs (
    id INT UNIQUE NOT NULL, 
    programName VARCHAR (255) NOT NULL,
    link VARCHAR
);

CREATE TABLE orders (
    id INT NOT NULL UNIQUE, 
    orderNumber INT NOT NULL UNIQUE, 
    personID INT,
    programID INT,
    FOREIGN KEY (personID) REFERENCES users(id),
    FOREIGN KEY (programID) REFERENCES programs(id)
);