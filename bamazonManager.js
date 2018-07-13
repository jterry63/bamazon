var config = require('./config');
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: config.pass,
    database: "bamazon_db"
})

connection.connect(function (err) {
    console.log('connected as id: ' + connection.threadId);
    start();
})

var start = function () {
    inquirer.prompt([
        {
            type: "list",
            message: "You are logged in as Manager. What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "option"
        }
    ])
        .then(function (inquirerResponse) {
            // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
            switch (inquirerResponse.option) {
                case "View Products for Sale":
                    forSale();
                    break;

                case "View Low Inventory":
                    //lowInventory();
                    break;

                case "Add to Inventory":
                    //addInventory();
                    break;

                case "Add New Product":
                    //addproduct();
                    break;

                default:
                    console.log("did not process");
            }
        });
}

var forSale = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("PRODUCTS FOR SALE");
        console.log('===============================')
        for (var i = 0, n = res.length; i < n; i++) {

            console.log('ID: ' + res[i].item_id);
            console.log('Item Name: ' + res[i].product_name)
            console.log('Price: ' + res[i].price)
            console.log('Amount left: ' + res[i].stock_quantity)
            console.log('--------------------')
        }
        start();
    })
}
