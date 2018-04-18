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
    supervisor();
})

function supervisor() {
    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "WHAMazon Supervisor Terminal - Select an Action",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
                "End Session"
            ]
        }
    ).then(function(answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
                viewDepartmentSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "End Session":
                console.log("Goodbye.\n***** CONNECTION TERMINATED *****\n");
                connection.end();
        }
    });
}

function viewDepartmentSales() {
    connection.query("SELECT department_name, SUM(product_sales) FROM whamazon_db.products GROUP BY department_name", function(err, res) {

        if (err) throw err;
        console.log(res);
        // // cli-table code
        // var table = new Table({
        //     head: ["Department", "Total Sales"],
        //     colWidths: [30, 30]
        // });

        // for (var i = 0; i < res.length; i++) {
        //     table.push([res[i].department_name, res[i].product_sales]);
        // };

        // console.log(table.toString() + "\n");
    })
}

function createDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "Enter the name of the department to add to the 'WHAMazon_db.departments' table."
        },
        {
            name: "overhead_costs",
            type: "input",
            message: "Enter the overhead costs in dollars and cents for the new department."
        }
    ]).then(function(newDepartment) {
        //console.log(requested.item_id);
        connection.query("INSERT INTO departments SET ?", { department_name: newDepartment.department_name, over_head_costs: newDepartment.overhead_costs}, function(err, res) {

            var departmentName = newDepartment.department_name;
            console.log(departmentName + " has been added to the departments table.\n--------------------------------------------------\n");
            setTimeout(function(){supervisor()},2000);
        });
    });
}