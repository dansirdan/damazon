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
  log(y("\n                       SUPERVISOR MODE...                      \n"));
  log(y(`██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(g(`██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(c(`██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║`));
  log(b(`██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║`));
  log(m(`██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║`));
  log(m(`╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝`));
  log(`\n`);
  supervisorTerminal();

});

// UI DIRECTORY FOR THE SUPERVISOr-------------------->
function supervisorTerminal() {

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: `${m("S_MODE: ")}What would you like to do...`,
    choices: [{
        key: 'a',
        name: "View Profits by DEPARTMENT",
        value: "v_pro_dep"
      },
      {
        key: 'b',
        name: "Create New DEPARTMENT",
        value: "aDep"
      },
      {
        key: 'c',
        name: "Create New SALE",
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

function v_pro_dep() {

  connection.query(`SELECT * FROM departments`, function (err, res) {

    if (err) throw err;

    // // AUTOPOPULATES THE DEPARTMENTS INTO A CHOICE ARRAY
    // // GET PRECISE DEPARTMENT DATA
    // // PRINT ALL FUNCTION TO COME...

    // let promptArr = [{
    //   key: `d`,
    //   name: `GO BACK`,
    //   value: `exit`
    // }];

    // // PROMPT CHOICE OBJECT ARRAY FOR LOOP
    // for (let i = 0; i < res.length; i++) {

    //   let d_id = res[i].department_id;
    //   let departmentName = res[i].department_name;
    //   let counter = 0;
    //   let choice_object = {

    //     key: `d${counter++}`,
    //     name: `${departmentName}`,
    //     value: `${d_id}`

    //   };

    //   promptArr.push(choice_object);

    // };

    // inquirer.prompt([{

    //   name: `pickItem`,
    //   type: `list`,
    //   message: `${m("S_MODE:")} View all ...`,
    //   choices: [{
    //     key: `a`,
    //     name: `VIEW ALL`,
    //     value: `view_all`
    //   }, {
    //     key: `b`,
    //     name: `GO BACK`,
    //     value: `exit`
    //   }]

    // }]).then(function (res) {

    //   let d_name = res.pickItem;
    //   if (d_name === `exit`) {

    //     log(`\n\nReturning to SUPERVISOR Terminal...\n\n`);
    //     supervisorTerminal();

    //   } else {

    connection.query(`SELECT departments.department_name,
                                 departments.over_head_costs,
                          SUM(products.product_sales) AS total_sales,
                          SUM(products.product_sales) - departments.over_head_costs AS total_profit
                          FROM departments
                          JOIN products USING(department_name)
                          GROUP BY department_name`,
      function (err, res) {

        if (err) throw err;

        // log(res);

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
          }

          table.push([`${dName}`, `${dCost}`, `${tSales}`, `${tProfit}`]);
        }

        log(`\n`);
        log(table.toString());
        log(`\n`);

        supervisorTerminal();

      });
    // }
    // });
  });
};

function aDep() {

  log(chalk.red(`\n\nINITIALIZING Add Department...\n\n`));

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

function createDepartment(name, cost) {

  log(`\n\nAdding Department to the Damazon Store...`);

  connection.query(`INSERT INTO departments SET ?`, {

      department_name: name,
      over_head_costs: cost

    },
    function (err, res) {

      if (err) throw err;

      log(`${res.affectedRows} department added.\n\n`);
      supervisorTerminal();

    });
};

function aSale() {

  log(chalk.magenta(`\n\nSUPERVISOR MODE: Make-Product-Sale coming soon...\n\n`));
  // CREATES A SALE ON A PRODUCT FOR
  // REMOVES A SALE ON A PRODUCT
  supervisorTerminal();

};

function exitTerminal() {

  log(`\n\n"Remember...make it a great day, or not; the choice is yours."\n\n`);
  connection.end();

};