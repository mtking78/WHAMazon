// initialize with "npm init -y", "npm install mysql", "npm install inquirer"
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
    currentInventory();
})

// First display all of the items available for sale.
function currentInventory() {
    console.log("Welcome to WHAMazon! - Here is the current inventory:\n");
    // console.log("# | Product Name | Department | Price\n--------------------------------------------------");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // cli-table code
        var table = new Table({
            head: ["id#", "Product Name", "Product Type", "Price"],
            colWidths: [5, 30, 20, 10]
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price]);
            // console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price);
        };
        console.log(table.toString());
        // console.log("--------------------------------------------------\n");

        inquirer.prompt(
            {
              name:"customerChoice",
              type:"confirm",
              message:"Would you like to make a purchase?",
              default: true
            }
        ).then(function(response){
            if (response.customerChoice === true) {
                setTimeout(function(){purchase()},2000);
            } else {
                console.log("You are missing out on great WHAM merchandise!\n***** CONNECTION TERMINATED *****\n");
                connection.end();
            };
        });
    });
}

// Ask them the ID of the product they would like to buy.
// Ask how many units of the product they would like to buy.
function purchase() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Enter the id# of the product you would like to purchase."
        },
        {
            name: "quantity",
            type: "input",
            message: "What quantity do you wish to purchase?"
        }
    ]).then(function(requested) {
        // Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
        //console.log(requested.item_id);
        connection.query("SELECT * FROM products WHERE ?", { item_id: requested.item_id }, function(err, res) {
            //console.log(res[0].stock_quantity);
            var productName = res[0].product_name;
            var unitPrice = res[0].price;
            var inStock = res[0].stock_quantity;

            // If your store has enough of the product, fulfill the order.
            // Update whamazon_db to reflect the new quantity.
            // Show the total cost of their purchase.
            if (inStock >= requested.quantity) {
                var stockUpdate = inStock - parseInt(requested.quantity);
                var purchaseCost = unitPrice * parseInt(requested.quantity);

                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: stockUpdate},{item_id: requested.item_id}], 
                    function(err, res) {
                        console.log("Your total cost for " + requested.quantity + " " + productName + " is $" + purchaseCost + "\nThank you for shopping with WHAMazon!\n--------------------------------------------------\n");
                    }
                );
            // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
            } else {
                console.log("Sorry, we do not have " + requested.quantity + " of " + productName + " in stock.\n");
            }
            //setTimeout(function(){currentInventory()},8000);
            currentInventory();
        });
    });
}