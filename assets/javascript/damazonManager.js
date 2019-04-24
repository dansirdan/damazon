const keys = require("./keys.js");
const inquirer = require("inquirer");
const mysql = require("mysql");
const dot = require("dotenv").config();
const Table = require("cli-table");
const chalk = require("chalk");
const log = console.log;

const connection = mysql.createConnection({
  host: keys.sql.host,
  port: 3306,
  user: keys.sql.user,
  password: keys.sql.password,
  database: keys.sql.database
});

connection.connect(function (err) {

  if (err) throw err;

  log(`\n\n`);
  log(chalk.yellowBright.italic("                       MANAGER MODE...                      \n"));
  log(chalk.yellow(`██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(chalk.green(`██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(chalk.cyan("██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║"));
  log(chalk.blue("██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║"));
  log(chalk.magenta("██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║"));
  log(chalk.magenta("╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝"));
  log(`\n`);

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

  log(`\n\nAccessing Product Data...`);

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
    log(`\n`);

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

  log(chalk.red(`\n\nINITIALIZING Add Product...\n\n`));

  connection.query(`SELECT * FROM departments`, function (err, res) {

    if (err) throw err;

    let promptArr = [];

    for (let i = 0; i < res.length; i++) {

      let departmentName = res[i].department_name;
      let department_ID = res[i].department_id;
      let counter = 0;
      let choice_object = {

        key: `d${counter++}`,
        name: `${departmentName}`,
        value: `${department_ID}`

      };

      promptArr.push(choice_object);

    };

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
        choices: promptArr
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
  });
};

function exitTerminal() {

  log(`\n\nWHO'S A GOOD MANAGER?\nYou are....\n\n`);
  connection.end();

};

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

    });
  });
};

function suggested() {

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
      message: `M_MODE: Suggested restock items...`,
      choices: promptArr

    }]).then(function (res) {

      let input_ID = res.pickItem;

      if (input_ID == 0) {

        log(`\n\nReturning to Main Terminal...\n\n`);
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
          stock_quantity: stock + amount,
          product_sales: 0.00
        },
        {
          id: product_ID
        }
      ],

      function (err, res) {

        if (err) throw err;

        log(chalk.green(`\n\n${productName} restocked...`));
        log(chalk.green(`TOTAL STOCK: ${stock + amount}\n\n`));
        managerTerminal();

      });
  });
};

function createItems(name, department, price, initStock) {

  log("\n\n" + chalk.green("ADDING_PRODUCT") + " to the Damazon Store...");

  connection.query(`INSERT INTO products SET ?`, {

      product_name: name,
      department_name: department,
      price: price,
      stock_quantity: initStock

    },
    function (err, res) {

      if (err) throw err;

      log(chalk.green(`${name} product added.\n\n`));
      managerTerminal();

    });
};