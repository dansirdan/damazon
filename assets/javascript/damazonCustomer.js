const keys = require("./keys.js");
const inquirer = require("inquirer");
const mysql = require("mysql");
const dot = require("dotenv").config();
const divider = `----------------------------------------`;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "damazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("\n\nWelcome to Damazon!\n\n");
  displayAvailable();
});

function displayAvailable() {

  console.log(`\n\nPopulating all the products...\n`);

  connection.query(`SELECT * FROM products`, function (err, res) {

    if (err) throw err;
    // console.log(res);

    for (let i = 0; i < res.length; i++) {
      console.log(`ID: ${res[i].id}`)
      console.log(`Product: ${res[i].product_name}`)
      console.log(`Price: $${res[i].price}`)
      console.log(divider);
    }
    // connection.end();
    pick_id();
  });
};

function kioskNav() {

}

function pick_id() {
  inquirer.prompt([{
    type: "input",
    message: "Type in the ID of the product you wish to buy...",
    name: "id"
  }]).then(function (res) {

    let check_id = res.id;
    if (Number.isInteger(check_id)) {
      console.log(`Please enter a valid ID number...`);
      pick_id();
    } else {
      pick_amount(check_id);
    }
  })
}

function pick_amount(check_id) {

  let product_id = check_id;

  inquirer.prompt([{
    type: "input",
    message: `How many would you like to buy?`,
    name: "amount"
  }]).then(function (res) {
    let product_amount = res.amount;
    if (Number.isInteger(product_amount)) {
      console.log(`Please enter a valid amount...`);
    } else {
      makeSale(product_id, product_amount);
    }
  })
}

function makeSale(product_id, product_amount) {
  console.log(`Processing your sale...`)

  connection.query(`SELECT stock_quantity FROM products WHERE id = ${product_id}`, function (err, res) {

    if (err) throw err;
    // console.log(res[0].stock_quantity);
    let stock = res[0].stock_quantity;


    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [{
          stock_quantity: stock - product_amount
        },
        {
          id: product_id
        }
      ],
      function (err, res) {
        if (err) throw err;
        console.log(`${res.affectedRows} products update!\n`)
        displayAvailable();
      }
    )

    console.log(query.sql);
  });


}