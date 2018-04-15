// initialize with "npm init -y", "npm install mysql", "npm install inquirer"
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "whamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log('connected as id ' + connection.threadId + '\n');
    // connection.end();
    manager();
})

function manager() {
    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "Welcome, master.  What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "End Session"
            ]
        }
    ).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "End Session":
                console.log("Goodbye, master.\n***** CONNECTION TERMINATED *****\n");
                connection.end();
        }
    });
}

// - If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    console.log("Here is the current inventory:\n");
    //console.log("# | Product Name | Department | Price | In Stock\n--------------------------------------------------");

    connection.query("SELECT * FROM products", function(err, res) {

        if (err) throw err;

        // cli-table code
        var table = new Table({
            head: ["id#", "Product Name", "Product Type", "Price", "# in-Stock"],
            colWidths: [5, 30, 20, 10, 15]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
        //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
        };

        console.log(table.toString() + "\n");
        // console.log("--------------------------------------------------\n");
        setTimeout(function(){manager()},2000);
    })
}

// - If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInventory() {
    console.log("Here is the all current inventory below 5 units:\n");
    //console.log("# | Product Name | In Stock\n--------------------------------------------------");

    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, res) {

        if (err) throw err;

        // cli-table code
        var table2 = new Table({
            head: ["id#", "Product Name", "in-Stock"],
            colWidths: [5, 30, 15]
        });

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                table2.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
                //console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
            }
        };

        console.log(table2.toString() + "\n");
        //console.log("--------------------------------------------------\n");
        setTimeout(function(){manager()},2000);
    })
}

// - If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {

    console.log("Here is the all current inventory:\n");
    //console.log("# | Product Name | In Stock\n--------------------------------------------------");

    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, res) {

        if (err) throw err;

        // cli-table code
        var table3 = new Table({
            head: ["id#", "Product Name", "in-Stock"],
            colWidths: [5, 30, 15]
        });

        for (var i = 0; i < res.length; i++) {
            table3.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
            //console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
        };

        console.log(table3.toString() + "\n");
        //console.log("--------------------------------------------------\n");
        setTimeout(function(){addInventoryUpdate()},2000);
    })
}

function addInventoryUpdate() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Enter the id# of the product you would like to add inventory for."
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units are being added?"
        }
    ]).then(function(added) {
        //console.log(requested.item_id);
        connection.query("SELECT * FROM products WHERE ?", { item_id: added.item_id }, function(err, res) {
            //console.log(res[0].stock_quantity);
            var productName = res[0].product_name;
            var inStock = res[0].stock_quantity;
            var addStock = inStock + parseInt(added.quantity);

            connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: addStock},{item_id: added.item_id}],
                function(err, res) {
                    console.log("Inventory updated for " + productName + "\n");
                }
            );

            console.log("--------------------------------------------------\n");
            setTimeout(function(){manager()},2000);
        });
    });
}

// - If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNewProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "Enter the name of the product you would like to add to the WHAMazon database."
        },
        {
            name: "department_name",
            type: "input",
            message: "Enter the name of the product type (department)."
        },
        {
            name: "price",
            type: "input",
            message: "Enter the unit price in dollars and cents."
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units are being added?"
        }
    ]).then(function(newProduct) {
        //console.log(requested.item_id);
        connection.query("INSERT INTO products SET ?", { product_name: newProduct.product_name, department_name: newProduct.department_name, price: newProduct.price, stock_quantity: newProduct.quantity,}, function(err, res) {

            var productName = newProduct.product_name;
            console.log(productName + " has been added to the inventory.\n--------------------------------------------------\n");
            setTimeout(function(){manager()},2000);
        });
    });
}