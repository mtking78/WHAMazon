USE whamazon_db;

DROP TABLE IF EXISTS whamazon_db.departments;
CREATE TABLE departments(
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs FLOAT(8,2) DEFAULT 0,
    PRIMARY KEY(department_id)
);

SELECT * FROM whamazon_db.departments;
INSERT INTO departments (department_name, over_head_costs)
VALUES  ("musician", 50000.00), 
        ("album", 2000.00), 
        ("single", 2000.00);
