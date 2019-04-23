console.log('this is loaded');
const dot = require("dotenv").config();

let sql = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_PASS
};

exports.sql = sql;