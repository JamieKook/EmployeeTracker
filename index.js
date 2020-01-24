const EmployeeTracker = require("./lib/Employee_Tracker"); 

const SqlQueries = require("./lib/sql_queries"); 
const InquirerPrompts = require("./lib/inquirer_prompts"); 

const sqlQueries = new SqlQueries; 
const inquirerPrompts = new InquirerPrompts; 

sqlQueries.beginConnection(startSession); 

function startSession() {
    inquirerPrompts.mainAsk().then(function(choice){
        let {action} = choice;  
        switchUserChoice(action); 
        }
    )
}

function switchUserChoice(action){
    switch (action) {
        case "View All Employees": 
            sqlQueries.viewAllData(startSession); 
            break; 
        case "View All Employees By Department": 
            viewByDepartmentMain();
            break; 
        case "View All Employees By Manager":
            viewByManagerMain(); 
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
        case "Update Employee Manager": 
            updateEmployeeManagerMain(); 
            break; 
        case "End Session": 
            console.log("Thank you for using Employee Tracker"); 
            sqlQueries.endConnection(); 
            break; 
        default:
            console.log("We don't have that functionality yet. Sorry."); 
            sqlQueries.endConnection(); 
    }
}

//main option functions from switch statement
async function viewByDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentNamesIds(); 
    let departmentNames = getDepartmentNamesOnly(departmentObjectArr); 
    inquirerPrompts.askDepartment(departmentNames).then(function(answer){
        let {departmentChoice}= answer; 
        sqlQueries.getTableByDepartment(departmentChoice, startSession); 
    })
}

async function viewByManagerMain(){
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
    employeeObjectArr.push({name: "none", id: null});
    names = getEmployeeNamesOnly(employeeObjectArr); 
    inquirerPrompts.askManager(names).then(function(answer){
        let managerObject= employeeObjectArr.find(employee => employee.name === answer.managerChoice); 
        let manager_id = managerObject.id; 
        sqlQueries.getTableByManager(manager_id, startSession); 
    }); 
}

async function addEmployee(){
    let roleObjectsArr= await sqlQueries.getRoleNamesIds();
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
    employeeObjectArr.push({name: "none", id: null});
    managers = getEmployeeNamesOnly(employeeObjectArr); 
    roles= getRoleNamesOnly(roleObjectsArr); 
    inquirerPrompts.askNewEmployeeQuestions(roles, managers).then( function(answers){
        sqlQueries.insertEmployeeData(roleObjectsArr, employeeObjectArr, answers, startSession); 
    });   
}

async function removeEmployee(){
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
    let employeeNames= getEmployeeNamesOnly(employeeObjectArr); 
    inquirerPrompts.askRemoveEmployeeQuestions(employeeNames).then(function(answer){
        let {employeeToRemove} = answer; 
        let firstName= employeeToRemove.split(" ")[0];
        let lastName=  employeeToRemove.split(" ")[1];
        sqlQueries.removeEmployeeData(firstName, lastName, startSession);
    });  
}

async function updateEmployeeRoleMain(){
    let employeeObjectArr= await sqlQueries.getCurrentEmployeeNamesIds(); 
    let roleObjectsArr= await sqlQueries.getRoleNamesIds();
    let employees = getEmployeeNamesOnly(employeeObjectArr); 
    let roles = getRoleNamesOnly(roleObjectsArr);  
    inquirerPrompts.askUpdateRoleQuestions(employees, roles).then(function(answers){
        sqlQueries.updateEmployeeRoleSql(employeeObjectArr, roleObjectsArr, answers, startSession); 
    })
}

async function updateEmployeeManagerMain(){
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds();
    let managerObjectArr = employeeObjectArr;
    managerObjectArr.push({name: "none", id: null}); 
    let employees = getEmployeeNamesOnly(employeeObjectArr); 
    let managers= getEmployeeNamesOnly(managerObjectArr); 
    inquirerPrompts.askUpdateMangerQuestions(employees, managers).then(function(answers){
        sqlQueries.updateEmployeeManagerSql(employeeObjectArr, managerObjectArr, answers, startSession); 
    })
}

//helper functions
function getDepartmentNamesOnly(departmentObjectsArr){
    let departmentNamesArr= [];
    for (const department of departmentObjectsArr){
        departmentNamesArr.push(department.name); 
    }
    return departmentNamesArr; 
}

function getEmployeeNamesOnly(employeeObjectArr){
    let employeeNamesArr = []; 
    for (const employee of employeeObjectArr){
        employeeNamesArr.push(employee.name); 
    }
    return employeeNamesArr; 
}

function getRoleNamesOnly(roleObjectsArr){
    let roleNamesArr= [];
    for (const role of roleObjectsArr){
        roleNamesArr.push(role.title); 
    }
    return roleNamesArr; 
}


