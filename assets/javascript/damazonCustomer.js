const keys = require("./keys");
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
  log(chalk.yellowBright.italic("                          WELCOME TO...                        \n"));
  log(chalk.yellow(`██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(chalk.green(`██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(chalk.cyan("██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║"));
  log(chalk.blue("██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║"));
  log(chalk.magenta("██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║"));
  log(chalk.magenta("╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝"));
  log(`\n`);

  customerTerminal();

});

function customerTerminal() {

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: "How can I help you today...",
    choices: [{
        key: 'a',
        name: `Shop Products by Department`,
        value: "s_pro_dep"
      },
      {
        key: 'b',
        name: "Shop Products by Sales - 'COMING SOON'",
        value: "s_pro_sales"
      },
      {
        key: 'c',
        name: "View All Products",
        value: "view_all"
      },
      {
        key: 'd',
        name: "SPEAK TO A MANAGER",
        value: "karen"
      },
      {
        key: 'e',
        name: "EXIT Damazon...",
        value: "exit"
      }
    ]
  }]).then(function (res) {

    let command = res.action;

    switch (command) {
      case "s_pro_dep":
        s_pro_dep();
        break
      case "s_pro_sales":
        s_pro_sales();
        break
      case "view_all":
        view_all();
        break
      case "karen":
        karen();
        break
      case "exit":
        exitTerminal();
        break
    };
  });
};

function s_pro_dep() {

  connection.query(`SELECT * FROM departments`, function (err, res) {

    if (err) throw err;

    let promptArr = [{
      key: `d`,
      name: `GO BACK`,
      value: 0
    }];

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

      type: "list",
      message: "Please SELECT the Product DEPARTMENT...",
      name: "department",
      choices: promptArr

    }]).then(function (res) {

      // log(res);

      if (res.department == 0) {

        log(`\n\nReturning to Main Terminal...\n\n`);
        customerTerminal();
        return;

      };

      connection.query(`SELECT products.id, products.product_name, departments.department_id FROM products INNER JOIN departments ON departments.department_name = products.department_name WHERE department_id = ${res.department}`, function (err, res) {

        if (err) throw err;

        // log(res);

        let promptArr = [];

        for (let i = 0; i < res.length; i++) {

          let productName = res[i].product_name;
          let product_ID = res[i].id;
          let counter = 0;
          let choice_object = {

            key: `p${counter++}`,
            name: `${productName}`,
            value: `${product_ID}`

          };

          promptArr.push(choice_object);

        };

        inquirer.prompt([{

          type: `list`,
          message: `What would you like to purchase...`,
          name: `product`,
          choices: promptArr

        }]).then(function (res) {

          let pID = res.product;
          pick_amount(pID);
          // log(pID);

        });
      });
    });
  });
};

function s_pro_sales() {

};

function view_all() {

  console.log(`\n\nPopulating all the products...\n`);

  connection.query(`SELECT * FROM products`, function (err, res) {

    if (err) throw err;

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

    table.push([`Product ID`, `Product NAME`, `Price`])

    for (let i = 0; i < res.length; i++) {

      let pro_id = res[i].id;
      let pro_name = res[i].product_name;
      let price = res[i].price;
      let stock = res[i].stock_quantity;

      if (stock <= 0) {
        price = chalk.red(`!${price}! OUT OF STOCK...so sorry!`);
      } else if (stock > 1 && stock <= 5) {
        price = chalk.yellow(`${price}`)
      } else {
        price = chalk.green(`${price}`)
      };

      table.push([`${pro_id}`, `${pro_name}`, `${price}`]);

    };

    log(`\n`);
    log(table.toString());
    log(`\n`);

    customerTerminal();

  });
};

function karen() {

  log(`\n\nYou use the hidden ability of your beehive up-do to intimidate the manager...`);
  log(`...`);
  log(`Your intimidation fails...`);
  log(`\n\nYou have been escorted off the premises...`);
  connection.end();

};

function exitTerminal() {

  log(`\n\n"Thank you for shopping at 'Damazon'.\nWe hope to see you again!"\n\n`);
  connection.end();

};

function pick_amount(pID) {

  let product_id = pID;

  inquirer.prompt([{

    type: "input",
    message: `How many would you like to buy?`,
    name: "amount"

  }]).then(function (res) {

    let product_amount = res.amount;
    makeSale(product_id, product_amount);

  });
};

function makeSale(product_id, product_amount) {

  log(chalk.green(`\n\nProcessing your sale...`));

  connection.query(`SELECT * FROM products WHERE id = ${product_id}`, function (err, res) {

    if (err) throw err;

    let stock = res[0].stock_quantity;
    let productName = res[0].product_name;
    let productPrice = res[0].price;

    if (stock <= 0) {

      log(`\n\nUnfortunately, we are out of ${productName}\n\n`)
      log(`Please search another Product ID...`)
      customerTerminal();

    } else {
      updateProducts(stock, product_amount, productPrice, product_id)
    }
  });
};

function updateProducts(stock, product_amount, productPrice, product_id) {

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: stock - product_amount,
        product_sales: productPrice * product_amount
      },
      {
        id: product_id
      }
    ],
    function (err, res) {

      if (err) throw err;
      log(`Total Sale: $${productPrice*product_amount}`);
      log(`${res.affectedRows} products updated!\n`);

      customerTerminal();

    });
};