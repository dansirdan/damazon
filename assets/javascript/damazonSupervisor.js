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

  log(`\n\n`);
  log(y("\n                          SUPERVISOR MODE...                      \n"));
  log(y(`   ██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(g(`   ██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(c(`   ██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║`));
  log(b(`   ██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║`));
  log(m(`   ██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║`));
  log(m(`   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝`));
  log(`\n`);
  supervisorTerminal();

});

// UI DIRECTORY FOR THE SUPERVISOr-------------------->
function supervisorTerminal() {

  // UNIVERSAL SPACER
  log(`\n\n`);

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: `${m("S_MODE: ")}What would you like to do...`,
    choices: [{
        key: 'a',
        name: "View All PROFITS",
        value: "v_pro_dep"
      },
      {
        key: 'b',
        name: "Create New DEPARTMENT",
        value: "aDep"
      },
      {
        key: 'c',
        name: `Create New SALE - ${r("COMING SOON")}`,
        value: "aSale"
      },
      {
        key: 'd',
        name: "EXIT SUPERVISOR MODE",
        value: "exit"
      }
    ]
  }]).then(function (res) {

    // console.log(res.action);
    let command = res.action;
    switch (command) {
      case "v_pro_dep":
        v_pro_dep();
        break
      case "aDep":
        aDep();
        break
      case "aSale":
        aSale();
        break
      case "exit":
        exitTerminal();
        break
    };
  });
};

// VIEW ALL PROFITS----------------------------------->
function v_pro_dep() {

  connection.query(`SELECT departments.department_name,
                           departments.over_head_costs,
                    SUM(products.product_sales) AS total_sales,
                    SUM(products.product_sales) - departments.over_head_costs AS total_profit
                    FROM departments
                    JOIN products USING(department_name)
                    GROUP BY department_name`,
    function (err, res) {

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

      table.push([`Department NAME`, `Department Costs`, `Product Sales`, `Total Profit`])

      for (let i = 0; i < res.length; i++) {
        let dName = res[i].department_name;
        let dCost = res[i].over_head_costs;
        let tSales = res[i].total_sales;
        let tProfit = res[i].total_profit;

        if (tProfit < 0) {
          tProfit = chalk.red(tProfit)
        } else {
          tProfit = chalk.green(tProfit)
        };

        table.push([`${dName}`, `${dCost}`, `${tSales}`, `${tProfit}`]);
      }

      log(`\n`);
      log(table.toString());
      supervisorTerminal();

    });
};

// ADD DEPARTMENT------------------------------------->
function aDep() {

  log(`\n\n`);
  log(y(`INITIALIZING ADD DEPARTMENT...`));
  log(`\n\n`);

  inquirer.prompt([{
      type: "input",
      message: `${m("S_MODE: ")}ENTER the Department NAME...`,
      name: "name"
    },
    {
      type: "input",
      message: `${m("S_MODE: ")}ENTER the Department OVER HEAD COSTS...`,
      name: "cost"
    }
  ]).then(function (res) {

    let name = res.name;
    let cost = res.cost;
    createDepartment(name, cost);

  });
};

// CREATE DEPARTMENT-------------------------------->
// Takes in the Supervisor's Choices
// department_name: 
// over_head_costs:
function createDepartment(name, cost) {

  log(`\n\n`);
  log(y(`ADDING NEW DEPARTMENT...`));
  log(`\n\n`);

  connection.query(`INSERT INTO departments SET ?`, {

      department_name: name,
      over_head_costs: cost

    },
    function (err, res) {

      if (err) throw err;

      log(y(`DEPARTMENT --${name}-- ADDED...`));
      log(y(`RETURNING to S_MODE Terminal...`));

      supervisorTerminal();

    });
};

// ANOTHER MOCK-UP DESIGN TO CREATE A SALE ON A DEPARTMENT
// Join products and departments
// Change all department products to be reduced by a percentage of the supervisor's choosing
// for loop runs through all products in chosen department
// UPDATE all products name: ....(30% OFF)
// UPDATE all products pric: ....(*.30)
function aSale() {

  log(`\n\n`);
  log(m(`SUPERVISOR MODE: Make-Product-Sale ${r("COMING SOON")}...`));
  // CREATES A SALE ON AN ENTIRE DEPARTMENT
  supervisorTerminal();

};

// EXIT THE SUPERVISOR TERMINAL && END CONNECTION
function exitTerminal() {
  log(`\n\n`);
  log(m(`Remember...make it a great day, or not; the choice is yours.`));
  log(`\n\n`);
  connection.end();
};