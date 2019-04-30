// CUSTOMER TERMINAL---------------------------------->
const keys = require("./keys");
const inquirer = require("inquirer");
const mysql = require("mysql");
const dot = require("dotenv").config();

// <NPM cli-table------------------------------------->
const Table = require("cli-table");

// <NPM CHALK----------------------------------------->
// and added usage of shorthand of the NPM...
// makes it WAY easy to read console.log(chalk.yellow(`<text here>`));
//                                   log(y(`<text here>`));
// also keeps my prints to screen readable in code...see below "DAMAZON"
const chalk = require("chalk");
const log = console.log;
const y = chalk.yellow;
const r = chalk.red;
const g = chalk.green;
const c = chalk.cyan;
const b = chalk.blue;
const m = chalk.magenta;
let greeting = 0;

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
  log(y(`\n                          WELCOME TO...                        \n`));
  log(y(`██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(g(`██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(c(`██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║`));
  log(b(`██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║`));
  log(m(`██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║`));
  log(m(`╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝`));
  log(`\n`);
  customerTerminal();

});

// UI DIRECTORY FOR CUSTOMER-------------------------->
function customerTerminal() {

  let greet_message;
  if (greeting === 0) {
    greet_message = `${m("Hello, I'm VIC...your Virtual Interactive Clerk.")}\nHow may I assist you today...`
    greeting++;
  } else {
    greet_message = `${m("VIC: ")}How may I assist you...`
  }
  log(`\n\n`);

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: greet_message,
    choices: [{
        key: 'a',
        name: `Shop Products by Department`,
        value: "s_pro_dep"
      },
      {
        key: 'b',
        name: `Shop Products by Sales - ${r("COMING SOON")}`,
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

    // TERMINAL SWITCH FUNCTION...
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

// SHOP PRODUCTS BY DEPARTMENT------------>
// queries for all departments...
// define a blank prompt array...
// define a go_back button...
// define in a for loop all departments as inquirer options...
// push each to the prompt array...
// run prompt with { key:__, name:__, choices: promptArr};
function s_pro_dep() {

  connection.query(`SELECT * FROM departments`, function (err, res) {

    if (err) throw err;

    let promptArr = [];
    let go_back = {
      key: `d`,
      name: `GO BACK`,
      value: 0
    };

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
    promptArr.push(go_back);

    inquirer.prompt([{

      type: "list",
      message: `${m("VIC: ")}Please select the department you wish to shop from...`,
      name: "department",
      choices: promptArr

    }]).then(function (res) {

      if (res.department == 0) {

        log(`\n\n`);
        log(r(`Returning to Main Terminal...`));
        customerTerminal();
        return;

      };

      // JOIN QUERY------------------------------------->
      // query an INNER JOIN for products in departments matching departments.department_name...
      //                                                             products.department_name...
      // REPEAT created method above of for looping what to buy into the choices prompt array...
      connection.query(`SELECT products.id, 
                               products.product_name,
                               departments.department_id
                        FROM products
                        INNER JOIN departments
                        ON departments.department_name = products.department_name
                        WHERE department_id = ${res.department}`,
        function (err, res) {

          if (err) throw err;

          let promptArr = [];
          let go_back = {
            key: `d`,
            name: `GO BACK`,
            value: 0
          };

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
          promptArr.push(go_back);

          if (res.department == 0) {

            log(`\n\n`);
            log(r(`Returning to Main Terminal...`));
            customerTerminal();
            return;

          } else {

            inquirer.prompt([{

              type: `list`,
              message: `${m("VIC: ")}What would you like to purchase...`,
              name: `product`,
              choices: promptArr

            }]).then(function (res) {

              let pID = res.product;
              pick_amount(pID);

            });
          }
        });
    });
  });
};

// SHOP PRODUCTS BY SALES -- MOCK UP -- -- -- -- -- -- -->
function s_pro_sales() {

  log(`\n\n`);
  log(r(`This is a mock up of how a manager might set a sale on an item...`));
  log(r(`Check out my commented out code in the Customer.js File to see the pseudo code.`))
  customerTerminal();

};

// VIEW ALL PRODUCTS------------------------------------->
// LOOK AT THIS FANCY TABLE NPM!
// Prints a BRILLIANT table to the terminal...
function view_all() {

  log(`\n\n`);
  log(y(`Populating all products...`));

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
    customerTerminal();

  });
};

// KAREN -- MANAGER FREE TOTE BAG if successful...
// purely fun but does a confirm inquirer
// Gives the user a free tote bag if a secret condition is met...
function karen() {

  log(r(`Calling the Manager now...please wait...`))
  inquirer.prompt([{

    type: "input",
    message: `${(y("You hear the manager on the phone, 'Hello! What's your name?"))}`,
    name: "karen"

  }]).then(function (res) {

    let hint = c("Karen");

    if (res.karen !== "Karen") {

      log(`\n`);
      log(r("You use your fake 'beehive up-do' to intimidate the manager over the phone..."));
      log(r(`The Manager reaches through the phone and yanks off your wig, revealing that you are not a real ${hint}...`));
      log(r("Your intimidation fails..."));
      log(r("\n\nThe Manager hangs up the phone..."));
      connection.end()


    } else {

      log(`\n`);
      log(y("You use the hidden ability of your 'beehive up-do' to intimidate the manager over the phone..."));
      log(y("The Manager begins to break down..."));
      log(y("..."));
      log(y("Your intimidation has succeeded."));
      log(g("You received a FREE Tote Bag..."));

      let product_amount = 0;
      let product_id = 11;
      makeSale(product_id, product_amount);

    };
  });
};

// EXIT TERMINAL
function exitTerminal() {

  log(`\n\n`);
  log(`${m("VIC: ")}Thank you for shopping at 'Damazon'.\nWe hope to see you again!`);
  connection.end();

};

// PICK HOW MANY YOU WOULD LIKE TO BUY
function pick_amount(pID) {

  let product_id = pID;

  inquirer.prompt([{
      type: "input",
      message: `${m("VIC: ")}How many would you like to buy?`,
      name: "amount"
    },
    {
      type: "confirm",
      message: `\n\n${m("VIC: ")}Are you sure...`,
      name: "check"
    }
  ]).then(function (res) {

    if (res.check === false) {

      log(`\n\n`);
      log(r(`Returning to Main Terminal...`));
      customerTerminal();
      return;

    } else {

      let product_amount = res.amount;
      makeSale(product_id, product_amount);

    };
  });
};

// MAKE SALE FUNCTION 
function makeSale(product_id, product_amount) {

  log(`\n\n`);
  log(g(`Processing your sale...`));

  connection.query(`SELECT * FROM products WHERE id = ${product_id}`, function (err, res) {

    if (err) throw err;

    let stock = res[0].stock_quantity;
    let productName = res[0].product_name;
    let productPrice = res[0].price;

    if (stock <= 0) {

      log(`\n\n`);
      log(r(`Unfortunately, we are out of ${productName}.`))
      log(r(`Please search another Product ID...`))
      customerTerminal();

    } else {
      updateProducts(productPrice, product_amount, stock, product_id)
    }
  });
};

// UPDATES THE PRODUCTS AND CREATES PRODUCT SALES info
function updateProducts(productPrice, product_amount, stock, product_id) {

  // UPDATE Table1
  // SET Field1 = Table2.Field1,
  //     Field2 = Table2.Field2,
  //     other columns...
  // FROM Table2
  // WHERE Table1.ID = Table2.ID

  let product_sales = productPrice * product_amount;
  let new_stock = stock - product_amount;

  connection.query(
    `UPDATE products
     SET products.stock_quantity = ${new_stock}, products.product_sales = ${product_sales}
     WHERE products.id = ${product_id}`,
    function (err, res) {

      if (err) throw err;

      log(g(`Total Sale: $${product_sales}`));

      customerTerminal();

    });
};