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
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
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

var lowInventory = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        lowInv = [];
        console.log("PRODUCTS WITH LOW INVENTORY");
        console.log('===============================')
        for (var i = 0, n = res.length; i < n; i++) {
            if (res[i].stock_quantity <= 50) {

                console.log(res[i].product_name + ": Quantity Remaining = " + res[i].stock_quantity);
                console.log('-----------------------')

            }
        }
        start();
    })
}

var addInventory = function () {
    inquirer.prompt([{
        type: "input",
        name: "toAdd",
        message: "What is the product ID that you would like to add inventory to?",
    }, {
        type: "input",
        name: "amount",
        message: 'how many units would you like to add?'

    }]).then(function (answers) {

        var amount = parseFloat(answers.amount);
        connection.query("SELECT * FROM products WHERE item_id= ?", [answers.toAdd], function (err, res) {
            if (err) throw err;

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: res[0].stock_quantity + amount,
            }, {
                item_id: answers.toAdd
            }], function (err, res) { });
            var newQ = res[0].stock_quantity + amount;
            console.log("----------------------");
            console.log("Item " + answers.toAdd + " has been updated! New stock quantity is " + newQ);
            console.log("----------------------");
            start();
        })

    });

}

var addProduct = function () {
    inquirer.prompt([{
        type: 'input',
        name: 'newProduct',
        message: 'What product would you like to add?'
    }, {
        type: 'input',
        name: 'amount',
        message: "How much are you adding?"
    }, {
        type: 'input',
        name: 'cost',
        message: 'How much does each item cost?',
    }, {
        type: 'input',
        name: 'dept',
        message: "What department is it being added to? "

    }]).then(function (answers) {
        var amount = parseFloat(answers.amount);
        var cost = parseFloat(answers.cost);
        connection.query("INSERT INTO products SET ?", {
            product_name: answers.newProduct,
            department_name: answers.dept,
            price: cost,
            stock_quantity: amount
        }, function (err, res) { });
        console.log("----------------------");
        console.log("Product has been added!");
        console.log("----------------------");
        start();

    })
}



