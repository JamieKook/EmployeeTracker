const SqlQueries = require("./lib/sql_queries"); 
const InquierPrompts = require("./lib/inquirer_prompts");
const Employee= require("./lib/newemployee");  
const Department = require("./lib/department");
const Role = require("./lib/role"); 

const sqlQueries = new SqlQueries(); 
const inquirerPrompts= new InquierPrompts();   

sqlQueries.beginConnection(startSession); 

function startSession() {
    inquirerPrompts.mainAsk().then(function(choice){
        let {action} = choice;  
        switchMangerment(action); 
        }
    )
}

function switchMangerment(action){
    switch (action) {
        //Employee Choices
        case "Employees": 
            inquirerPrompts.EmployeeAsk().then(function(choice){
                let {action}= choice; 
                switchUserChoice(action); 
            })
            break; 
        case "Departments": 
            inquirerPrompts.DepartmentAsk().then(function(choice){
                let {action}= choice; 
                switchUserChoice(action); 
            })
            break; 
        case "Roles": 
            inquirerPrompts.RoleAsk().then(function(choice){
                let {action}= choice; 
                switchUserChoice(action); 
            })
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

function switchUserChoice(action){
    switch (action) {
        //Employee Choices
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
        //department choices
        case "View All Departments":
            sqlQueries.viewAllDepartments(startSession); 
            break; 
        case "Add Department": 
            addDepartmentMain(); 
            break; 
        case "Remove Department": 
            removeDepartmentMain(); 
            break; 
        //role choices
        case "View All Roles":
            sqlQueries.viewAllRoles(startSession); 
            break; 
        case "View All Roles By Department":
            viewRolesByDepartmentMain(); 
            break; 
        case "Add Role":
            addRoleMain(); 
            break; 
        case "Remove Role":
            removeRoleMain(); 
            break; 
        case "Update Role Department":
            updateRoleDepartmentMain(); 
            break; 
        case "Go Back To Main Menu":
            startSession(); 
            break; 
        case "End Session": 
            console.log("Thank you for using Employee Tracker"); 
            sqlQueries.endConnection(); 
            break; 
        default:
            console.log("We don't have that functionality yet. Sorry."); 
            startSession(); 
    }
}

//main option functions from switch statement
//Employee Choices
async function viewByDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
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
    let roleObjectArr= await sqlQueries.getRoleData();
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData(); 
    employeeObjectArr.push({name: "none", id: null});
    managers = getEmployeeNamesOnly(employeeObjectArr); 
    roles= getRoleNamesOnly(roleObjectArr); 
    inquirerPrompts.askNewEmployeeQuestions(roles, managers).then( function(answers){
        const employee= initializeNewEmployee(answers, employeeObjectArr, roleObjectArr); 
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
    let roleObjectArr= await sqlQueries.getRoleData();
    let employees = getEmployeeNamesOnly(employeeObjectArr); 
    let roles = getRoleNamesOnly(roleObjectArr);  
    inquirerPrompts.askUpdateRoleQuestions(employees, roles).then(function(answers){ 
        const employee = initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectArr);
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

//Department Choices
async function viewRolesByDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
    let departmentNames = getDepartmentNamesOnly(departmentObjectArr); 
  
    inquirerPrompts.askDepartment(departmentNames).then(function(answer){
        const department = new Department(answer.departmentChoice); 
        department.getDepartmentId(departmentObjectArr); 
        sqlQueries.getRolesByDepartment(department, startSession); 
    })
}

async function addDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
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
    let departmentObjectArr = await sqlQueries.getDepartmentData();
    let roleObjectArr = await sqlQueries.getRoleData(); 
    let departmentNames = getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askRemoveDepartmentQuestions(departmentNames).then(function(answer){
        const department = initializeRemovedDepartment(answer, departmentObjectArr, roleObjectArr); 
        if (!department.hasRoles){
            sqlQueries.removeDepartmentData(department, startSession); 
        } else {
            console.log(`\nYou cannot remove this department!\n\n It includes the role(s) of${department.createStringOfRoles()}.\n\nPlease remove the role(s) of${department.createStringOfRoles()} first.\n`); 
            startSession(); 
        }
    })
}

//Role Choices
async function addRoleMain(){
    let roleObjectArr = await sqlQueries.getRoleData();
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
    let departmentNames = getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askNewRoleQuestions(departmentNames).then(function(answers){
        const role= initializeNewRole(answers, roleObjectArr, departmentObjectArr); 
        if (role.isValid && !role.isDuplicate) {
            sqlQueries.addRoleData(role, startSession); 
        }else{
            console.log("\nRole was NOT added to the database.\n\n"); 
            startSession(); 
        }
    });
}

async function removeRoleMain(){
    let roleObjectArr = await sqlQueries.getRoleData();
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData(); 
    let roleNames = getRoleNamesOnly(roleObjectArr);  
    inquirerPrompts.askRemoveRoleQuestions(roleNames).then(function(answer){
        const role = initializeRemovedRole(answer, roleObjectArr, employeeObjectArr); 
        if (!role.hasEmployees){
            sqlQueries.removeRoleData(role, startSession); 
        } else {
            console.log(`\nYou cannot remove this role!\n\n It is the role of employees ${role.createStringOfEmployees()}.\n\nPlease change the role(s) of${role.createStringOfEmployees()} first.\n`); 
            startSession(); 
        }
    })
}

async function updateRoleDepartmentMain(){
    let roleObjectArr= await sqlQueries.getRoleData(); 
    let departmentObjectArr= await sqlQueries.getDepartmentData();
    let roles = getRoleNamesOnly(roleObjectArr); 
    let departments = getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askUpdateDepartmentQuestions(roles, departments).then(function(answers){ 
        const role = initializeUpdatedDepartmentRole(answers, roleObjectArr, departmentObjectArr);
        if (role.isUpdated){
            sqlQueries.updateRoleDepartmentSql(role, startSession); 
        } else {
            console.log(`\n${role.name} is already in the ${role.departmentName} department!\n`);
            startSession(); 
        }; 
        
    })
}

//helper functions
//Get names from arrays
function getDepartmentNamesOnly(departmentObjectArr){
    let departmentNamesArr= [];
    for (const department of departmentObjectArr){
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

function getRoleNamesOnly(roleObjectArr){
    let roleNamesArr= [];
    for (const role of roleObjectArr){
        roleNamesArr.push(role.title); 
    }
    return roleNamesArr; 
}

function splitName(name){
    let firstName= name.split(" ")[0];
    let lastName=  name.split(" ")[1];
    return {firstName: firstName, lastName: lastName}; 
}

//Initialize Objects
//Employees
function initializeNewEmployee(answers, employeeObjectArr, roleObjectArr){
    const employee= new Employee(answers.firstName.trim(), answers.lastName.trim(), null, answers.role, answers.manager);
    employee.getEmployeeId(employeeObjectArr);
    employee.getRoleId(roleObjectArr);
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

 function initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectArr){
    let employeeName = splitName(answers.employeeToUpdate); 
    const employee = new Employee(employeeName.firstName, employeeName.lastName, null, answers.newRole); 
    employee.getEmployeeId(employeeObjectArr); 
    employee.getRoleId(roleObjectArr); 
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

//Departments
function initializeNewDepartment(answer, departmentObjectArr){
    let {newDepartment} = answer; 
    const department = new Department(newDepartment.trim()); 
    department.checkForDuplicates(departmentObjectArr); 
    return department; 
}

function initializeRemovedDepartment(answer, departmentObjectArr, roleObjectArr){
    let {departmentToRemove} = answer; 
    const department = new Department(departmentToRemove);
    department.getDepartmentId(departmentObjectArr); 
    department.checkForRoles(roleObjectArr);
    return department; 
}

//Roles
function initializeNewRole(answers, roleObjectArr, departmentObjectArr){
    const role = new Role(answers.newRole.trim(), answers.salary.trim(), answers.department); 
    role.checkForDuplicates(roleObjectArr);
    role.getDepartmentId(departmentObjectArr);  
    return role; 
}

function initializeRemovedRole(answer, roleObjectArr, employeeObjectArr){
    const role = new Role(answer.roleToRemove);
    role.getRoleId(roleObjectArr);
    console.log(role.id);  
    role.checkForEmployees(employeeObjectArr);
    return role; 
}

function initializeUpdatedDepartmentRole(answers, roleObjectArr, departmentObjectArr){
    const role = new Role (answers.roleToUpdate, null, answers.newDepartment); 
    role.getRoleId(roleObjectArr); 
    role.getDepartmentId(departmentObjectArr); 
    role.checkUpdatedDepartment(roleObjectArr); 
    return role; 
}
