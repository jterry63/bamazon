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
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What is the product ID that you would like to purchase?",
    }, {
        type: "input",
        name: "units",
        message: 'how many units would you like to buy?'

    }]).then(function (answers) {


        connection.query('SELECT * FROM products WHERE item_id = ' + answers.id, function (err, res) {

            if (err) throw err;

            var unitsRemaining = res[0].stock_quantity

            if (answers.units > unitsRemaining) {
                console.log("--------------------------------------------")
                console.log('Insufficient quantity!')
                console.log("--------------------------------------------")
                start();
            } else {
                unitsRemaining = unitsRemaining - answers.units;
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: unitsRemaining
                }, {
                    item_id: answers.id
                }], function (err, res) { });
                console.log("--------------------------------------------")
                console.log('Your total is: $' + res[0].price * answers.units);
                console.log("Remaining units: " + unitsRemaining);
                console.log("--------------------------------------------")
                start();
            }

        })


    })
}