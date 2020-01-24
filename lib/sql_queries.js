const mysql = require("mysql");
const joinTables=  "SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary FROM employee as E JOIN role as R on E.role_id = R.id JOIN department as D on D.id = R.department_id"; 
const {MySQL} = require("mysql-promisify"); 
const db= new MySQL({
    host: "localhost", 
    port: 3306,
    user: "jamie",
    password: "1234pass",
    database: "employee_tracker"
}); 

class SqlQueries{
    constructor(){

    }
    
}