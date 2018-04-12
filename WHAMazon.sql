-- Create a MySQL Database called bamazon.
-- Then create a Table inside of that database called products.
-- The products table should have each of the following columns:

--     item_id (unique id for each product)
--     product_name (Name of product)
--     department_name
--     price (cost to customer)
--     stock_quantity (how much of the product is available in stores)

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
DROP DATABASE IF EXISTS whamazon_db;
CREATE DATABASE whamazon_db;

USE whamazon_db;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price FLOAT(4,2) DEFAULT 0,
    stock_quantity INT(4) DEFAULT 0,
    PRIMARY KEY(item_id)
);

SELECT * FROM whamazon_db.products;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("George Michael", "musician", 6306.25, 1), 
        ("Andrew Ridgeley", "musician" , 6301.26, 1), 
        ("Fantastic", "album", 13.99, 30), 
        ("Make It Big", "album", 15.99, 50), 
        ("The Final", "album", 8.99, 20), 
        ("Music From the Edge of Heaven", "album", 10.99, 20), 
        ("Wham Rap!", "single", 0.25, 200), 
        ("Young Guns", "single", 0.99, 200), 
        ("Bad Boys", "single", 1.99, 200), 
        ("Club Tropicana", "single", 1.99, 200), 
        ("Wake Me Up Before You Go-Go", "single", 3.99, 500), 
        ("Careless Whisper", "single", 4.99, 500), 
        ("Freedom", "single", 2.99, 300), 
        ("Everything She Wants", "single", 5.99, 500), 
        ("Last Christmas", "single", 3.49, 400), 
        ("I'm Your Man", "single", 1.95, 300), 
        ("The Edge of Heaven", "single", 1.95, 300), 
        ("Where Did Your Heart Go?", "single", 1.95, 300);