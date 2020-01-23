const mysql = require("mysql"); 
const inquirer= require("inquirer"); 
const cTable = require("console.table");
// const EmployeeTracker = require("./lib/Employee_Tracker"); 
const joinTables = "SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary FROM employee as E JOIN role as R on E.role_id = R.id JOIN department as D on D.id = R.department_id"; 

//Set up connection to mysql
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "jamie",
    password: "1234pass",
    database: "employee_tracker"
}); 

// const employeeTracker = new EmployeeTracker(); 

//connect to mysql
connection.connect(async function(err) {
    if (err) throw err; 
    console.log("Welcome to the Employee Tracker!");
    startSession(); 
}); 

function startSession() {
    mainAsk().then(function(choice){
        let {action} = choice;  
        switchUserChoice(action); 
        }
    )
}

function mainAsk() {
    return inquirer
        .prompt(
            [
                {type: "list", 
                name: "action", 
                message: "What would you like to do?", 
                choices:
                    ["View All Employees" , 
                    "View All Employees By Department", 
                    "View All Employees By Manager", 
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "End Session"
                    ]
                }
            ]
        );
}

function switchUserChoice(action){
    switch (action) {
        case "View All Employees": 
            viewAllData(); 
            break; 
        case "View All Employees By Department": 
            viewByDepartmentMain();
            break; 
        case "Add Employee": 
            addEmployee(); 
            break; 
        case "End Session": 
            console.log("Thank you for using Employee Tracker"); 
            connection.end(); 
            break; 
        default:
            console.log("We don't have that functionality yet. Sorry."); 
            connection.end(); 
    }
}

function viewAllData() {
    connection.query(joinTables+ " ORDER BY E.id", function(err, res) {
      if (err) throw err;
      console.log("\n\n"); 
      console.table(res); 
      startSession(); 
    });
}

function askDepartment(names){
    return inquirer
        .prompt(
            [
                {type: "list",
                name: "departmentChoice",
                message: "Which department would you like to view?",
                choices: names
                }
            ]
        ); 
}

function viewByDepartmentMain(){
    connection.query("SELECT name FROM department", function(err,res){
        if (err) throw err; 
        let departmentNamesArr=[];
        for (const row of res){
            departmentNamesArr.push(row.name); 
        }
        askDepartment(departmentNamesArr).then(function(choice) {
            let {departmentChoice} = choice; 
            getTableByDepartment(departmentChoice); 
        }); 
    }); 
}

function getTableByDepartment(department){
    connection.query(`${joinTables} WHERE D.name = "${department}" ORDER BY E.id`, function(err,res){
        if (err) throw err;
        console.log("\n\n"); 
        console.table(res); 
        startSession();
    }); 
}

function addEmployee(){
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err; 
        let roleData = res; 
        let roleNamesArr=[];
        for (const row of res){
            roleNamesArr.push(row.title); 
        }
        collectEmployeeData(roleNamesArr); 
    });
}

function collectEmployeeData(roleNamesArr){
    return connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err; 
        let employeeData= res; 
        let employeeNamesArr= ["None"]; 
        for (const row of res){
            let name = `${row.first_name} ${row.last_name}`; 
            employeeNamesArr.push(name); 
        }
        askNewEmployeeQuestions(roleNamesArr, employeeNamesArr).then( function(newEmployeeData){
            insertEmployeeData(roleNamesArr, employeeNamesArr, newEmployeeData); 
        });  

    })
}

function insertEmployeeData(roleNamesArr, employeeNamesArr, data){
    let role_id= roleNamesArr.indexOf(data.role)+1; 
    let manager_id= employeeNamesArr.indexOf(data.manager); 
    if (manager_id === 0){
        manager_id = null; 
    }
    console.log(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${role_id}, ${manager_id})`); 
    console.log(manager_id); 
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${role_id}, ${manager_id})`, function(err, res){
        if (err) throw error;
        console.log(`Added ${data.firstName} ${data.lastName} to the database`); 
        startSession(); 
    }); 

}
function askNewEmployeeQuestions(roles, managers){
    const newEmployeeQuestions= [
        {type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
        },
        {type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
        },
        {type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roles
        },
        {type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers
        }
    ]; 
    return inquirer
        .prompt(newEmployeeQuestions); 
}