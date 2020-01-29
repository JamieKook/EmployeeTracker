const SqlQueries = require("./lib/sql_queries"); 
const InquierPrompts = require("./lib/inquirer_prompts");
const Initializer = require("./lib/initialize"); 

const sqlQueries = new SqlQueries(); 
const inquirerPrompts= new InquierPrompts();
const initializer = new Initializer();    

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
        case "View Total Utilzied Budget By Department": 
            budgetMain(); 
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
    let departmentNames = initializer.getDepartmentNamesOnly(departmentObjectArr); 
    inquirerPrompts.askDepartment(departmentNames).then(function(answer){
        let {departmentChoice}= answer; 
        sqlQueries.getTableByDepartment(departmentChoice, startSession); 
    })
}

async function viewByManagerMain(){
    let employeeObjectArr = await sqlQueries.getCurrentEmployeeData(); 
    employeeObjectArr.push({name: "none", id: null});
    names = initializer.getEmployeeNamesOnly(employeeObjectArr); 
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
    managers = initializer.getEmployeeNamesOnly(employeeObjectArr); 
    roles= initializer.getRoleNamesOnly(roleObjectArr); 
    inquirerPrompts.askNewEmployeeQuestions(roles, managers).then( function(answers){
        const employee= initializer.initializeNewEmployee(answers, employeeObjectArr, roleObjectArr); 
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
    let employeeNames= initializer.getEmployeeNamesOnly(employeeObjectArr); 
    inquirerPrompts.askRemoveEmployeeQuestions(employeeNames).then(function(answer){
        const employee= initializer.initializeRemovedEmployee(answer, employeeObjectArr)
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
    let employees = initializer.getEmployeeNamesOnly(employeeObjectArr); 
    let roles = initializer.getRoleNamesOnly(roleObjectArr);  
    inquirerPrompts.askUpdateRoleQuestions(employees, roles).then(function(answers){ 
        const employee = initializer.initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectArr);
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
    let employees = initializer.getEmployeeNamesOnly(employeeObjectArr); 
    let managers= initializer.getEmployeeNamesOnly(managerObjectArr); 
    inquirerPrompts.askUpdateMangerQuestions(employees, managers).then(function(answers){
       const employee = initializer.initializeUpdatedManagerEmployee(answers,employeeObjectArr, managerObjectArr); 
       if (employee.isUpdated){
        sqlQueries.updateEmployeeManagerSql(employee, startSession); 
       } else {
        console.log(`\n${employee.fullName} already has ${employee.managerName} as her/his manager!\n`);
        startSession(); 
       }
        
    })
}

async function viewRolesByDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
    let departmentNames = initializer.getDepartmentNamesOnly(departmentObjectArr); 
    inquirerPrompts.askDepartment(departmentNames).then(function(answer){ 
        const department = initializer.initializeViewDepartment(answer, departmentObjectArr); 
        sqlQueries.getRolesByDepartment(department, startSession); 
    })
}

//Department Choices
async function addDepartmentMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
    inquirerPrompts.askNewDepartmentQuestions().then(function(answer){
        const department= initializer.initializeNewDepartment(answer, departmentObjectArr); 
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
    let departmentNames = initializer.getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askRemoveDepartmentQuestions(departmentNames).then(function(answer){
        const department = initializer.initializeRemovedDepartment(answer, departmentObjectArr, roleObjectArr); 
        if (!department.hasRoles){
            sqlQueries.removeDepartmentData(department, startSession); 
        } else {
            console.log(`\nYou cannot remove this department!\n\n It includes the role(s) of${department.createStringOfRoles()}.\n\nPlease remove the role(s) of${department.createStringOfRoles()} first.\n`); 
            startSession(); 
        }
    })
}

async function budgetMain(){
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
    departmentNames = initializer.getDepartmentNamesOnly(departmentObjectArr); 
    inquirerPrompts.askDepartment(departmentNames).then(async function(answer){
        let {departmentChoice} = answer; 
        let results = await sqlQueries.getTableByDepartment(departmentChoice); 
        let budget = null; 
        for (const employee of results){
            budget += employee.salary; 
        }
        console.log(`The total utilized budget for the ${departmentChoice} department is $${budget}\n\n`); 
        startSession(); 
    })
}; 

//Role Choices
async function addRoleMain(){
    let roleObjectArr = await sqlQueries.getRoleData();
    let departmentObjectArr = await sqlQueries.getDepartmentData(); 
    let departmentNames = initializer.getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askNewRoleQuestions(departmentNames).then(function(answers){
        const role= initializer.initializeNewRole(answers, roleObjectArr, departmentObjectArr); 
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
    let roleNames = initializer.getRoleNamesOnly(roleObjectArr);  
    inquirerPrompts.askRemoveRoleQuestions(roleNames).then(function(answer){
        const role = initializer.initializeRemovedRole(answer, roleObjectArr, employeeObjectArr); 
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
    let roles = initializer.getRoleNamesOnly(roleObjectArr); 
    let departments = initializer.getDepartmentNamesOnly(departmentObjectArr);  
    inquirerPrompts.askUpdateDepartmentQuestions(roles, departments).then(function(answers){ 
        const role = initializer.initializeUpdatedDepartmentRole(answers, roleObjectArr, departmentObjectArr);
        if (role.isUpdated){
            sqlQueries.updateRoleDepartmentSql(role, startSession); 
        } else {
            console.log(`\n${role.name} is already in the ${role.departmentName} department!\n`);
            startSession(); 
        }; 
        
    })
}
