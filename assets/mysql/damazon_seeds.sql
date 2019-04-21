CREATE DATABASE damazon_db;

USE damazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Green Towel", "Home and Bath", 13.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("J&J Shampoo", "Home and Bath", 5.25, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Toilet Paper", "Home and Bath", 15.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("17 in Monitor", "Electronics", 96.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Zune MP3 Player", "Electronics", 217.15, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Alienware Desktop", "Electronics", 2999.99, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Red Dress", "Clothing", 53.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Swim Trunks", "Clothing", 34.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Green Dress - (that's cruel)", "Clothing", 53.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Birthday Suit", "Clothing", 800.00, 1);