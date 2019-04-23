USE damazon_db;

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES("Home and Bath", 5000);

INSERT INTO departments (department_name, over_head_costs)
VALUES("Electronics", 3000);

INSERT INTO departments (department_name, over_head_costs)
VALUES("Clothing", 1000);

-- THIS WILL BE FOR OUR AUCTION HOUSE IN THE DREAM RPG:

-- INSERT INTO departments (department_name, over_head_costs)
-- VALUES("Armor", 2000);

-- INSERT INTO departments (department_name, over_head_costs)
-- VALUES("Weapons", 2000);

-- INSERT INTO departments (department_name, over_head_costs)
-- VALUES("Spell Books", 2000);

-- INSERT INTO departments (department_name, over_head_costs)
-- VALUES("Magical Items", 2000);

-- INSERT INTO departments (department_name, over_head_costs)
-- VALUES("Potions", 2000);

-- INSERT INTO departments (department_name, over_head_costs)
-- VALUES("misc.", 1000);