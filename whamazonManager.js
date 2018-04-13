// initialize with "npm init -y", "npm install mysql", "npm install inquirer"
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "2631mountain",
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
                "Add New Product"
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
        }
    });
}

// - If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    console.log("Here is the current inventory:\n");
    console.log("# | Product Name | Department | Price | In Stock\n--------------------------------------------------");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
        };
        console.log("--------------------------------------------------\n");
        setTimeout(function(){manager()},8000);
    })
}

// - If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInventory() {
    console.log("Here is the all current inventory below 5 units:\n");
    console.log("# | Product Name | In Stock\n--------------------------------------------------");

    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, res) {

        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
            }
        };
        console.log("--------------------------------------------------\n");
        setTimeout(function(){manager()},8000);
    })
}

// - If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.


// - If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.