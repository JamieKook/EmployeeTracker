const mysql = require("mysql"); 
const inquirer= require("inquirer"); 
const cTable = require("console.table");
const EmployeeTracker = require("./lib/Employee_Tracker"); 
const joinTables = "SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary FROM employee as E INNER JOIN role as R on E.role_id = R.id INNER JOIN department as D on D.id = R.department_id"; 
// const util = require("util"); 
const {MySQL} = require("mysql-promisify"); 


//Set up connection to mysql
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "jamie",
    password: "1234pass",
    database: "employee_tracker"
}); 

//promsifiy connection- probably don't need both; 
const db= new MySQL({
    host: "localhost", 
    port: 3306,
    user: "jamie",
    password: "1234pass",
    database: "employee_tracker"
}); 

// const queryAsync = util.promisify(connection.query); 
// const employeeTracker = new EmployeeTracker(); 

//connect to mysql
connection.connect(async function(err) {
    if (err) throw err; 
    console.log("Welcome to the Employee Tracker!");
    startSession(); 
    // employeeTracker.startSession(); 
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
        case "Remove Employee":
            removeEmployee(); 
            break; 
        case "Update Employee Role":
            updateEmployeeRoleMain(); 
            break; 
        case "End Session": 
            console.log("Thank you for using Employee Tracker"); 
            connection.end(); 
            db.end(); 
            break; 
        default:
            console.log("We don't have that functionality yet. Sorry."); 
            connection.end(); 
            db.end(); 
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

//functions to view by department 
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

//functions to add employees
async function addEmployee(){
    let roleObjectsArr= await getRoleNamesIds();
    let employeeObjectArr = await getCurrentEmployeeNamesIds(); 
    employeeObjectArr.push({name: "none", id: null});
    askNewEmployeeQuestions(roleObjectsArr, employeeObjectArr).then( function(newEmployeeData){
        insertEmployeeData(roleObjectsArr, employeeObjectArr, newEmployeeData); 
    });   
}

function insertEmployeeData(roleObjectsArr, employeeObjectArr, data){
    let roleObject= roleObjectsArr.find(role => role.title === data.role); 
    let role_id= roleObject.id; 
    const managerObject = employeeObjectArr.find(employee => employee.name === data.manager); 
    let manager_id = managerObject.id; 
    console.log(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${role_id}, ${manager_id})`); 
    console.log(manager_id); 
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${role_id}, ${manager_id})`, function(err, res){
        if (err) throw error;
        console.log(`Added ${data.firstName} ${data.lastName} to the database`); 
        startSession(); 
    }); 

}
function askNewEmployeeQuestions(roles, managers){
    managers = getEmployeeNamesOnly(managers); 
    roles= getRoleNamesOnly(roles); 
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

//functions to remove employees
async function removeEmployee(){
    let employeeObjectArr = await getCurrentEmployeeNamesIds(); 
    askRemoveEmployeeQuestions(employeeObjectArr).then(function(removeEmployeeData){
        let {employeeToRemove} = removeEmployeeData; 
        let firstName= employeeToRemove.split(" ")[0];
        let lastName=  employeeToRemove.split(" ")[1];
        connection.query(
            `DELETE FROM employee WHERE ? AND ?`,
            [
                {
                    first_name: firstName
                },
                { 
                    last_name: lastName
                }
            ],
            function(err, res){
                if (err) throw err; 
                console.log(`Removed ${employeeToRemove} from the database`); 
                startSession(); 
            }
        ); 
    }); 
}

function askRemoveEmployeeQuestions(employeeNames){
    employeeNames= getEmployeeNamesOnly(employeeNames); 
    return inquirer
        .prompt(
            [
                {type: "list",
                name: "employeeToRemove",
                message: "Which employee do you want to remove?",
                choices: employeeNames
                }
            ]
        )
}

async function getCurrentEmployeeNamesIds(){
    try{
        const {results} = await db.query({
            sql: "SELECT first_name, last_name, id FROM employee",
        });  
        let employeeObjectArr= []; 
        for (const row of results){
            let employeeObject = {name: `${row.first_name} ${row.last_name}`,
                                    id: row.id}; 
            employeeObjectArr.push(employeeObject); 
        }
        return employeeObjectArr; 
    } catch(err){
        console.log(err); 
    } 
}

function getEmployeeNamesOnly(employeeObjectArr){
    let employeeNamesArr = []; 
    for (const employee of employeeObjectArr){
        employeeNamesArr.push(employee.name); 
    }
    return employeeNamesArr; 
}

async function getRoleNamesIds(){
    try {
        const {results} = await db.query({
            sql: "SELECT title, id FROM role",
        }); 
        let roleObjectsArr=[]; 
        for (const row of results){
            roleObjectsArr.push({title: row.title, id: row.id}); 
        }
        return roleObjectsArr; 
    } catch(err) {
        console.log(err); 
    }
}

function getRoleNamesOnly(roleObjectsArr){
    let roleNamesArr= [];
    for (const role of roleObjectsArr){
        roleNamesArr.push(role.title); 
    }
    return roleNamesArr; 
}

//functions to update employee role
async function updateEmployeeRoleMain(){
    let employeeObjectArr= await getCurrentEmployeeNamesIds(); 
    let roleObjectsArr= await getRoleNamesIds(); 
    askUpdateRoleQuestions(employeeObjectArr, roleObjectsArr).then(function(updateEmployeeData){
        updateEmployeeRoleSql(employeeObjectArr, roleObjectsArr, updateEmployeeData); 
    })
}

function askUpdateRoleQuestions(employees, roles) {
    const updateRoleQuestions= [
        {type: "list",
        name: "employeeToUpdate",
        message: "Which employee's role do you want to update?",
        choices: employees
        },
        {type: "list",
        name: "newRole",
        message: "What is the employee's new role?",
        choices: roles
        }
    ]; 
    return inquirer
        .prompt(updateRoleQuestions); 
}

function updateEmployeeRoleSql(employeeObjectArr, roleObjectsArr,updateEmployeeData){
    let {employeeToUpdate} = updateEmployeeData;
    let employeeId= employeeObjectArr.indexOf(employeeToUpdate)+1; 
    let {newRole} = updateEmployeeData;
    let role_id= roleObjectsArr.indexOf(newRole)+1; 
    connection.query(
        `UPDATE employee SET ? WHERE ?`,
        [
            {
                role_id: role_id
            },
            {
                id: employeeId
            }
        ], 
        function (err, res){
            if (err) throw err; 
            console.log( `Updated ${employeeToUpdate} to the new role of ${newRole}`); 
            startSession(); 
        }
    ); 
}