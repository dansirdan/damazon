// MANAGER TERMINAL----------------------------------->
const keys = require("./keys.js");
const inquirer = require("inquirer");
const mysql = require("mysql");
const dot = require("dotenv").config();

// <NPM cli-table------------------------------------->
const Table = require("cli-table");

// <NPM CHALK----------------------------------------->
const chalk = require("chalk");
const log = console.log;
const y = chalk.yellow;
const r = chalk.red;
const g = chalk.green;
const c = chalk.cyan;
const b = chalk.blue;
const m = chalk.magenta;

// CONNECTION CONST----------------------------------->
const connection = mysql.createConnection({
  host: keys.sql.host,
  port: 3306,
  user: keys.sql.user,
  password: keys.sql.password,
  database: keys.sql.database
});

// INITIALIZATION------------------------------------->
connection.connect(function (err) {

  if (err) throw err;
  log(y("\n                        MANAGER MODE...                        \n"));
  log(y(`██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(g(`██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(c(`██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║`));
  log(b(`██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║`));
  log(m(`██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║`));
  log(m(`╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝`));
  log(`\n`);
  managerTerminal();

});

// UI DIRECTORY FOR MANAGERS------------------------->
function managerTerminal() {

  log(`\n\n`);

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: `${m('M_MODE: ')}What would you like to do?`,
    choices: [{
        key: 'a',
        name: "View all Products",
        value: "vPro"
      },
      {
        key: 'b',
        name: "Add to Inventory",
        value: "aInv"
      },
      {
        key: 'c',
        name: "Add new Product",
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

// VIEW ALL PRODUCTS-------------------------------->
function vPro() {

  log(`Accessing Product Data...`);

  connection.query(`SELECT * FROM products`, function (err, res) {

    if (err) throw err;

    // OBSOLETE WITH CHALK NPM...BUT I WILL CONTINUE TO LEARN ABOUT THIS:
    // var red = "\033[91m";
    // var b = "\033[0m";
    // var ylw = "\33[93m";
    // var grn = "\33[92m";

    // console.log(`\n\n${red}RED:${b} EMPTY STOCK`);
    // console.log(`${ylw}YELLOW:${b} LOW STOCK`);
    // console.log(`${grn}GREEN:${b} IN STOCK\n\n`);

    let table = new Table({

      chars: {
        'top': '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        'bottom': '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        'left': '║',
        'left-mid': '╟',
        'mid': '─',
        'mid-mid': '┼',
        'right': '║',
        'right-mid': '╢',
        'middle': '│'
      }

    });

    table.push([`Product ID`, `Product NAME`, `Price`, `Stock`])

    for (let i = 0; i < res.length; i++) {

      let pro_id = res[i].id;
      let pro_name = res[i].product_name;
      let pro_price = res[i].price;
      let stock = res[i].stock_quantity;

      if (stock <= 0) {
        pro_name = chalk.red(pro_name);
        stock = chalk.red(`${stock} OUT OF STOCK`);
      } else if (stock >= 1 && stock <= 9) {
        stock = chalk.yellow(`${stock} LOW STOCK`);
      } else if (res[i].stock_quantity >= 10) {
        stock = chalk.green(stock);
      };

      table.push([`${pro_id}`, `${pro_name }`, `${pro_price}`, `${stock}`]);

    };

    log(`\n`);
    log(table.toString());
    managerTerminal();

  });
};

function aInv() {

  inquirer.prompt([{
    name: "add_action",
    type: "list",
    message: `${m('M_MODE: ')}Initializing ADD INVENTORY...`,
    choices: [{
        key: "y",
        name: `ADD INVENTORY by ${y("PRODUCT ID Number")}...`,
        value: "search"
      },
      {
        key: "z",
        name: `ADD INVENTORY by ${y("LOW STOCK")}...`,
        value: "suggest"
      }
    ]
  }]).then(function (res) {

    let addCommand = res.add_action;

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

// ADD NEW PRODUCT CHOICES PULLED FROM DEPARTMENTS----->
// query to create an array of choice objects
// all dept. names
// query >> prompt{queryChoiceArray} >> query
function aPro() {

  log(`\n\n`);
  log(y(`INITIALIZING Add Product...`));
  log(`\n\n`);

  connection.query(`SELECT * FROM departments`, function (err, res) {

    if (err) throw err;

    let promptArr = [];

    for (let i = 0; i < res.length; i++) {

      let departmentName = res[i].department_name;
      let counter = 0;
      let choice_object = {

        key: `d${counter++}`,
        name: `${departmentName}`,
        value: `${departmentName}`

      };

      promptArr.push(choice_object);

    };

    inquirer.prompt([{
        type: "input",
        message: `${m("M_MODE: ")}ENTER the Product NAME...`,
        name: "name"
      },
      {
        type: "input",
        message: `${m("M_MODE: ")}ENTER the Product PRICE...`,
        name: "price"
      },
      {
        type: "list",
        message: `${m("M_MODE: ")}ENTER the Product DEPARTMENT...`,
        name: "department",
        choices: promptArr
      },
      {
        type: "input",
        message: `${m("M_MODE: ")}ENTER the Product STOCK...`,
        name: "stock"
      }
    ]).then(function (res) {

      let name = res.name;
      let price = res.price;
      let department = res.department;
      let initStock = res.stock;
      createItems(name, department, price, initStock);

    });
  });
};

// EXIT MANAGER TERMINAL && END CONNECTION---------->
function exitTerminal() {
  log(`\n\n`);
  log(m(`WHO'S A GOOD MANAGER...you are. Nice work today.`));
  log(`\n`);
  connection.end();
};

// UPDATE INVENTORY BY PRODUCT ID----------------->
function search_by_id() {

  log(`\n\n`);
  log(y(`INITIALIZING Update Inventory...`));
  log(`\n\n`);

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

    });
  });
};

// UPDATE INVENTORY BASED OFF LOW STOCK---------->
// just something extra, more practical
function suggested() {

  log(`\n\n`);
  log(y(`INITIALIZING Update Inventory...`));
  log(`\n\n`);

  connection.query(`SELECT * FROM products WHERE stock_quantity <= 9`, function (err, res) {

    if (err) throw err;

    let promptArr = [{
      key: `d`,
      name: `GO BACK`,
      value: 0
    }];

    for (let i = 0; i < res.length; i++) {

      let stock = res[i].stock_quantity;
      let productName = res[i].product_name;
      let product_ID = res[i].id;
      let counter = 0;
      let choice_object = {

        key: `c${counter++}`,
        name: `${productName} || Stock: ${stock}`,
        value: `${product_ID}`

      };
      promptArr.push(choice_object);
    };

    inquirer.prompt([{

      name: `pickItem`,
      type: `list`,
      message: `${m("M_MODE: ")}Products by ${y("LOW STOCK")}...`,
      choices: promptArr

    }]).then(function (res) {

      let input_ID = res.pickItem;

      if (input_ID == 0) {

        log(`\n\n`);
        log(y(`Returning to Main Terminal...`));
        managerTerminal();
        return;

      };

      connection.query(`SELECT * FROM products WHERE id = ${input_ID}`, function (err, res) {

        if (err) throw err;

        let stock = res[0].stock_quantity;
        let productName = res[0].product_name;
        let product_ID = res[0].id;
        restock(productName, stock, product_ID);

      });
    });
  });
};

// RESTOCK FUNCTION TO CHOOSE AMOUNT----------->
function restock(productName, stock, product_ID) {

  log(`\n\n`);
  log(y(`FINALIZING Update Inventory...`));
  log(`\n\n`);

  inquirer.prompt([{

    name: "amount",
    type: "list",
    message: `${m("MANAGER MODE: ")}How many ${productName}(s) would you like to restock...`,
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
          stock_quantity: stock + amount,
          product_sales: 0.00
        },
        {
          id: product_ID
        }
      ],

      function (err, res) {

        if (err) throw err;

        log(`\n\n`);
        log(g(`${productName} restocked...`));
        log(g(`TOTAL STOCK: ${stock + amount}`));
        managerTerminal();

      });
  });
};

// CREATE NEW PRODUCT------------------------------>
function createItems(name, department, price, initStock) {

  // log("\n\n" + chalk.green("ADDING_PRODUCT") + " to the Damazon Store...");
  log(`\n\n`);
  log(y(`ADDING ${name} to DAMAZON STORE...`))

  connection.query(`INSERT INTO products SET ?`, {

      product_name: name,
      department_name: department,
      price: price,
      stock_quantity: initStock,
      product_sales: 0.00

    },
    function (err, res) {

      if (err) throw err;

      log(g(`${name} ADDED...`));
      managerTerminal();

    });
};