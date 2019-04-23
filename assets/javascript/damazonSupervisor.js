const keys = require("./keys.js");
const inquirer = require("inquirer");
const mysql = require("mysql");
const dot = require("dotenv").config();
const Table = require("cli-table");
const chalk = require("chalk");
const log = console.log;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "damazon_db"
});

connection.connect(function (err) {

  if (err) throw err;

  log(`\n\n`);
  log(chalk.yellowBright.italic("                       SUPERVISOR MODE...                      \n"));
  log(chalk.yellow(`██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗  ██████╗ ███╗   ██╗`));
  log(chalk.green(`██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝ ██╔═══██╗████╗  ██║`));
  log(chalk.cyan("██║  ██║███████║██╔████╔██║███████║  ███╔╝  ██║   ██║██╔██╗ ██║"));
  log(chalk.blue("██║  ██║██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝   ██║   ██║██║╚██╗██║"));
  log(chalk.magenta("██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗ ╚██████╔╝██║ ╚████║"));
  log(chalk.magenta("╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚═╝  ╚═══╝"));
  log(`\n`);

  supervisorTerminal();

});

function supervisorTerminal() {

  inquirer.prompt([{
    name: "action",
    type: "list",
    message: "S_MODE: What would you like to do...",
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

    // AUTOPOPULATES THE DEPARTMENTS INTO A CHOICE ARRAY
    // GET PRECISE DEPARTMENT DATA
    // PRINT ALL FUNCTION TO COME...

    let promptArr = [{
      key: `d`,
      name: `GO BACK`,
      value: 0
    }];

    // PROMPT CHOICE OBJECT ARRAY FOR LOOP
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

      name: `pickItem`,
      type: `list`,
      message: `S_MODE: view by DEPARTMENT...`,
      choices: promptArr

    }]).then(function (res) {

      let input_ID = res.pickItem;

      if (input_ID == 0) {

        log(`\n\nReturning to SUPERVISOR Terminal...\n\n`);
        supervisorTerminal();
        return;

      };

      connection.query(`SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON departments.department_id = ${input_ID}`, function (err, res) {

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

        table.push([`Department ID`, `Department NAME`, `Department Costs`, `Product Sales`, `Total Profit`])

        let dept_id = res[0].department_id;
        let dName = res[0].department_name;
        let dCost = res[0].over_head_costs;
        let dSales = res[0].product_sales;
        let tProfit = dSales - dCost;

        if (tProfit < 0) {
          tProfit = chalk.red(tProfit)
        } else {
          tProfit = chalk.green(tProfit)
        }

        table.push([`${dept_id}`, `${dName}`, `${dCost}`, `${dSales}`, `${tProfit}`]);

        log(`\n`);
        log(table.toString());
        log(`\n`);

        supervisorTerminal();

      });
    });
  });
};

function aDep() {

  log(chalk.red(`\n\nINITIALIZING Add Department...\n\n`));

  inquirer.prompt([{
      type: "input",
      message: "ENTER the Department NAME...",
      name: "name"
    },
    {
      type: "input",
      message: "ENTER the Department OVER HEAD COSTS...",
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