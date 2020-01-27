const SqlQueries = require("./lib/sql_queries"); 
const InquierPrompts = require("./lib/inquirer_prompts");
const Employee= require("./lib/newemployee");  
const Department = require("./lib/department"); 

const sqlQueries = new SqlQueries(); 
const inquirerPrompts= new InquierPrompts();   

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
        case "Add Department": 
            addDepartmentMain(); 
            break; 
        case "Remove Department": 
            removeDepartmentMain(); 
            break; 
        case "Add Role":

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
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData(); 
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
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData(); 
    employeeObjectArr.push({name: "none", id: null});
    managers = getEmployeeNamesOnly(employeeObjectArr); 
    roles= getRoleNamesOnly(roleObjectsArr); 
    inquirerPrompts.askNewEmployeeQuestions(roles, managers).then( function(answers){
        const employee= initializeNewEmployee(answers, employeeObjectArr, roleObjectsArr); 
        if (employee.isValid && !employee.isDuplicate){
                sqlQueries.insertEmployeeData(employee, startSession); 
        } else {
            console.log("\nEmployee was NOT added to the database.\n\nPlease Re-enter this employee\n\n"); 
            startSession();  
        }
    });   
}

async function removeEmployee(){
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData();
    let employeeNames= getEmployeeNamesOnly(employeeObjectArr); 
    inquirerPrompts.askRemoveEmployeeQuestions(employeeNames).then(function(answer){
        const employee= initializeRemovedEmployee(answer, employeeObjectArr)
        if (!employee.isManager){
            sqlQueries.removeEmployeeData(employee, startSession);
        } else {
            console.log(`\nYou cannot remove this employee!\n\nShe/he is the manager of${employee.createStringOfEmployees()}.\n\nPlease update the manager of${employee.createStringOfEmployees()} first.\n`); 
            startSession(); 
        }
    });  
}

async function updateEmployeeRoleMain(){
    let employeeObjectArr= await sqlQueries.getCurrentEmployeeData(); 
    let roleObjectsArr= await sqlQueries.getRoleNamesIds();
    let employees = getEmployeeNamesOnly(employeeObjectArr); 
    let roles = getRoleNamesOnly(roleObjectsArr);  
    inquirerPrompts.askUpdateRoleQuestions(employees, roles).then(function(answers){ 
        const employee = initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectsArr);
        if (employee.isUpdated){
            sqlQueries.updateEmployeeRoleSql(employee, startSession); 
        } else {
            console.log(`\n${employee.fullName} already has the role of ${employee.roleTitle}!\n`);
            startSession(); 
        }; 
        
    })
}

async function updateEmployeeManagerMain(){
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData();
    let managerObjectArr = employeeObjectArr.map(object => object);
    managerObjectArr.push({name: "none", id: null}); 
    let employees = getEmployeeNamesOnly(employeeObjectArr); 
    let managers= getEmployeeNamesOnly(managerObjectArr); 
    inquirerPrompts.askUpdateMangerQuestions(employees, managers).then(function(answers){
       const employee = initializeUpdatedManagerEmployee(answers,employeeObjectArr, managerObjectArr); 
       if (employee.isUpdated){
        sqlQueries.updateEmployeeManagerSql(employee, startSession); 
       } else {
        console.log(`\n${employee.fullName} already has ${employee.managerName} as her/his manager!\n`);
        startSession(); 
       }
        
    })
}

async function addDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentNamesIds(); 
    inquirerPrompts.askNewDepartmentQuestions().then(function(answer){
        const department= initializeNewDepartment(answer, departmentObjectArr); 
        if (department.isValid && !department.isDuplicate) {
            sqlQueries.addDepartmentData(department, startSession); 
        }else{
            console.log("\nDepartment was NOT added to the database.\n\n"); 
            startSession(); 
        }
    });
}

async function removeDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentNamesIds();
    console.log(departmentObjectArr); 
    let roleObjectsArr = await sqlQueries.getRoleNamesIds(); 
    let departmentNames = getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askRemoveDepartmentQuestions(departmentNames).then(function(answer){
        const department = initializeRemovedDepartment(answer, departmentObjectArr, roleObjectsArr); 
        if (!department.hasRoles){
            sqlQueries.removeDepartmentData(department, startSession); 
        } else {
            console.log(`\nYou cannot remove this department!\n\n It includes the role(s) of${department.createStringOfRoles()}.\n\nPlease remove the role(s) of${department.createStringOfRoles()} first.\n`); 
            startSession(); 
        }
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

function splitName(name){
    let firstName= name.split(" ")[0];
    let lastName=  name.split(" ")[1];
    return {firstName: firstName, lastName: lastName}; 
}

function initializeNewEmployee(answers, employeeObjectArr, roleObjectsArr){
    const employee= new Employee(answers.firstName.trim(), answers.lastName.trim(), null, answers.role, answers.manager);
    employee.getEmployeeId(employeeObjectArr);
    employee.getRoleId(roleObjectsArr);
    employee.getManagerId(employeeObjectArr); 
    employee.checkForDuplicates(managers); 
    return employee; 
}

function initializeRemovedEmployee(answer, employeeObjectArr){
    let employeeName= splitName(answer.employeeToRemove); 
    let employee = new Employee(employeeName.firstName, employeeName.lastName);
    employee.checkForManager(employeeObjectArr); 
    return employee; 
}

 function initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectsArr){
    let employeeName = splitName(answers.employeeToUpdate); 
    const employee = new Employee(employeeName.firstName, employeeName.lastName, null, answers.newRole); 
    employee.getEmployeeId(employeeObjectArr); 
    employee.getRoleId(roleObjectsArr); 
    employee.checkUpdatedRole(employeeObjectArr); 
    return employee; 
}

function initializeUpdatedManagerEmployee(answers,employeeObjectArr, managerObjectArr){
    let employeeName = splitName(answers.employeeToUpdate); 
    const employee = new Employee(employeeName.firstName, employeeName.lastName, null, null, answers.newManager); 
    employee.getEmployeeId(employeeObjectArr); 
    employee.getManagerId(managerObjectArr);
    employee.checkUpdatedManager(employeeObjectArr); 
    if (employee.id === employee.managerId){
        employee.managerId = null; 
        employee.managerName = "none"; 
    }
    return employee; 
}

function initializeNewDepartment(answer, departmentObjectArr){
    let {newDepartment} = answer; 
    const department = new Department(newDepartment.trim()); 
    department.checkForDuplicates(departmentObjectArr); 
    return department; 
}

function initializeRemovedDepartment(answer, departmentObjectArr, roleObjectsArr){
    let {departmentToRemove} = answer; 
    const department = new Department(departmentToRemove);
    department.getDepartmentId(departmentObjectArr); 
    department.checkForRoles(roleObjectsArr);
    return department; 
}