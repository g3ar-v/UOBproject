const { Connection, Request } = require("tedious");
const { auth } = require("express-openid-connect");

//Database connection
//Azure Database Connection handler
const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    type: "default",
  },
  server: process.env.DB_HOST,
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
  },
};

//Maybe it needs to be asynchronous
/* let studentArray = []; */

/* connection.on("connect", function (err) {
  // If no error, then good to proceed.
  console.log("Connected");
  executeStatement();
}); */
let request;

const executeSQL = (query) =>
  new Promise((resolve, reject) => {
    let result = [];

    const connection = new Connection(config);

    connection.on("connect", (err) => {
      if (err) {
        reject(err);
      } else {
        connection.execSql(request);
      }
    });

    const request = new Request(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });

    request.on("row", (columns) => {
      let rowObject = {};
      columns.forEach((column) => {
        rowObject[column.metadata.colName] = column.value;
      });
      result.push(rowObject);
    });
    connection.connect();
  });

//View Users
exports.view = (req, res) => {
  executeSQL(
    "SELECT studentID, first_name, last_name, email, phone_number FROM students"
  )
    .then((ok) => {
      res.render("home", { ok });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  executeSQL(
    "SELECT studentID, first_name, last_name, email, phone_number FROM students WHERE first_name LIKE ? OR last_name LIKE ?",
    ["%" + searchTerm + "%", "%" + searchTerm + "%"]
  )
    .then((ok) => {
      res.render("home", { ok });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Add new user
exports.form = (req, res) => {
  res.render("add-user");
};
