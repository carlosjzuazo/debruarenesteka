CREATE DATABASE IF NOT EXISTS deabruarenesteka;

use deabruarenesteka;

CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL
    );

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description VARCHAR(500),
  id_user INT UNSIGNED,
  url VARCHAR(100),
  FOREIGN KEY (id_user) REFERENCES users (id)
);


