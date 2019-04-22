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
  managerTerminal();
});

function managerTerminal() {

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: "MANAGER MODE: What would you like to do?",
    choices: [{
        key: 'a',
        name: "View Products for Sale",
        value: "vPro"
      },
      {
        key: 'b',
        name: "Add to Inventory",
        value: "aInv"
      },
      {
        key: 'c',
        name: "Add New Product",
        value: "aPro"
      },
      {
        key: 'd',
        name: "EXIT MANAGER MODE",
        value: "exit"
      }
    ]
  }]).then(function (res) {

    // console.log(res.action);
    let command = res.action;
    switch (command) {
      case "vPro":
        vPro();
        break
      case "aInv":
        aInv();
        break
      case "aPro":
        aPro();
        break
      case "exit":
        exitTerminal();
        break
    };
  });

};

function vPro() {

  console.log(`\n\nAccessing Product Data...`);

  connection.query(`SELECT * FROM products`, function (err, res) {

    if (err) throw err;

    var red = "\033[91m";
    var b = "\033[0m";
    var ylw = "\33[93m";
    var grn = "\33[92m";

    console.log(`\n\n${red}RED:${b} EMPTY STOCK`);
    console.log(`${ylw}YELLOW:${b} LOW STOCK`);
    console.log(`${grn}GREEN:${b} IN STOCK\n\n`);

    for (let i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 0) {
        console.log(`${res[i].product_name} || ID: ${res[i].id} || Price: $${res[i].price} || ${red}Stock: ${res[i].stock_quantity}${b}`);
      } else if (res[i].stock_quantity >= 4 && res[i].stock_quantity <= 9) {
        console.log(`${res[i].product_name} || ID: ${res[i].id} || Price: $${res[i].price} || ${ylw}Stock: ${res[i].stock_quantity}${b}`);
      } else if (res[i].stock_quantity >= 10) {
        console.log(`${res[i].product_name} || ID: ${res[i].id} || Price: $${res[i].price} || ${grn}Stock: ${res[i].stock_quantity}${b}`);
      };
    };

    managerTerminal();

  });
};

function aInv() {

  inquirer.prompt([{
    name: "add_action",
    type: "list",
    message: "Initializing ADD ITEM command...",
    choices: [{
        key: "y",
        name: "ADD ITEM by ID Number...",
        value: "search"
      },
      {
        key: "z",
        name: "ADD ITEM by suggested population...",
        value: "suggest"
      }
    ]
  }]).then(function (res) {
    let addCommand = res.add_action;
    console.log(addCommand);
    switch (addCommand) {
      case "search":
        search_by_id();
        break;
      case "suggest":
        suggested();
        break;
    };
  });
};

function aPro() {

  console.log(`\n\nINITIALIZING Add Product...\n\n`)

  inquirer.prompt([{
      type: "input",
      message: "ENTER the Product NAME...",
      name: "name"
    },
    {
      type: "input",
      message: "ENTER the Product PRICE...",
      name: "price"
    },
    {
      type: "list",
      message: "ENTER the Product DEPARTMENT...",
      name: "department",
      choices: ["Home and Bath", "Electronics", "Clothing"]
    },
    {
      type: "input",
      message: "ENTER the Product STOCK...",
      name: "stock"
    }
  ]).then(function (res) {

    let name = res.name;
    let price = res.price;
    let department = res.department;
    let initStock = res.stock;
    createItems(name, department, price, initStock);

  });
};

function exitTerminal() {
  console.log(`\n\nHave a good day, way to manage people...\n\n`)
  connection.end();
}

function search_by_id() {

  inquirer.prompt([{
    name: "id_input",
    type: "input",
    message: "Please enter Product ID..."
  }]).then(function (res) {

    let input_ID = res.id_input;
    connection.query(`SELECT * FROM products WHERE id = ${input_ID}`, function (err, res) {

      if (err) throw err;
      let stock = res[0].stock_quantity;
      let productName = res[0].product_name;
      let product_ID = res[0].id;
      restock(productName, stock, product_ID);
    })
  })
}

function suggested() {

  connection.query(`SELECT * FROM products WHERE stock_quantity <= 9`, function (err, res) {
    if (err) throw err;

    let promptArr = [];

    for (let i = 0; i < res.length; i++) {
      let stock = res[i].stock_quantity;
      let productName = res[i].product_name;
      let product_ID = res[i].id;
      let counter = 0;
      let choice_object = {
        key: `c${counter++}`,
        name: `${productName} || Stock: ${stock}`,
        value: `${product_ID}`
      }
      promptArr.push(choice_object);
    }

    inquirer.prompt([{
      name: `pickItem`,
      type: `list`,
      message: `MANNAGER MODE: Suggested restock items...`,
      choices: promptArr
    }]).then(function (res) {
      let input_ID = res.pickItem;
      connection.query(`SELECT * FROM products WHERE id = ${input_ID}`, function (err, res) {

        if (err) throw err;
        let stock = res[0].stock_quantity;
        let productName = res[0].product_name;
        let product_ID = res[0].id;
        restock(productName, stock, product_ID);
      })
    })
  })

}

function restock(productName, stock, product_ID) {

  inquirer.prompt([{
    name: "amount",
    type: "list",
    message: `MANAGER MODE: how many ${productName}(s) would you like to restock...`,
    choices: [{
        key: 'l',
        name: "1",
        value: 1
      },
      {
        key: 'm',
        name: "5",
        value: 5
      },
      {
        key: 'n',
        name: "10",
        value: 10
      },
      {
        key: 'o',
        name: "20",
        value: 20
      }
    ]
  }]).then(function (res) {
    let amount = res.amount;
    connection.query(`UPDATE products SET ? WHERE ?`,
      [{
          stock_quantity: stock + amount
        },
        {
          id: product_ID
        }
      ],
      function (err, res) {
        if (err) throw err;
        console.log(`\n\n${productName} restocked...`)
        console.log(`TOTAL STOCK: ${stock + amount}\n\n`)
        managerTerminal();
        // console.log(`Total Sale: $${productPrice*product_amount}`);
        // console.log(`${res.affectedRows} products updated!\n`);
      });
  });
};

function createItems(name, department, price, initStock) {
  console.log(`\n\nAdding Product to the Damazon Store...`);
  connection.query(`INSERT INTO products SET ?`, {

      product_name: name,
      department_name: department,
      price: price,
      stock_quantity: initStock
    },
    function (err, res) {
      if (err) throw err;
      console.log(`${res.affectedRows} product added.\n\n`)
      managerTerminal();
    }
  )
}