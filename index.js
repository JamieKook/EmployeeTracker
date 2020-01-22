const mysql = require("mysql"); 
const inquirer= require("inquirer"); 

const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "jamie",
    password: "1234pass",
    database: "employee_tracker"
}); 

connection.connect(function(err) {
    if (err) throw err; 
    console.log("connected as id "+ connection.threadId); 
    afterConnection(); 
}); 

function afterConnection() {
    connection.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name, R.salary FROM employee as E JOIN role as R on E.role_id = R.id JOIN department as D on D.id = R.department_id", function(err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    });
}