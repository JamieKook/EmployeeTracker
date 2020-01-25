const SqlQueries = require("./sql_queries"); 
const InquirerPrompts = require("./inquirer_prompts"); 

const sqlQueries = new SqlQueries(); 
const inquirerPrompts = new InquirerPrompts(); 

class EmployeeTracker {
    constructor(){
    }

    //main option functions from switch statement
    async viewByDepartmentMain(startSession){
        let departmentObjectArr = await sqlQueries.getDepartmentNamesIds(); 
        let departmentNames = this.getDepartmentNamesOnly(departmentObjectArr); 
        let answer = await inquirerPrompts.askDepartment(departmentNames); 
        let {departmentChoice}= answer; 
        sqlQueries.getTableByDepartment(departmentChoice, startSession); 
    }
    
    async viewByManagerMain(startSession){
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
        employeeObjectArr.push({name: "none", id: null});
        names = this.getEmployeeNamesOnly(employeeObjectArr); 
        inquirerPrompts.askManager(names).then(function(answer){
            let managerObject= employeeObjectArr.find(employee => employee.name === answer.managerChoice); 
            let manager_id = managerObject.id; 
            sqlQueries.getTableByManager(manager_id, startSession); 
        }); 
    }
    
    async addEmployee(startSession){
        let roleObjectsArr= await sqlQueries.getRoleNamesIds();
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
        employeeObjectArr.push({name: "none", id: null});
        managers = EmployeeTracker.getEmployeeNamesOnly(employeeObjectArr); 
        roles= EmployeeTracker.getRoleNamesOnly(roleObjectsArr); 
        inquirerPrompts.askNewEmployeeQuestions(roles, managers).then( function(answers){
            sqlQueries.insertEmployeeData(roleObjectsArr, employeeObjectArr, answers, startSession); 
        });   
    }
    
    async removeEmployee(startSession){
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
        let employeeNames= this.getEmployeeNamesOnly(employeeObjectArr); 
        inquirerPrompts.askRemoveEmployeeQuestions(employeeNames).then(function(answer){
            let {employeeToRemove} = answer; 
            let firstName= employeeToRemove.split(" ")[0];
            let lastName=  employeeToRemove.split(" ")[1];
            sqlQueries.removeEmployeeData(firstName, lastName, startSession);
        });  
    }
    
    async updateEmployeeRoleMain(startSession){
        let employeeObjectArr= await sqlQueries.getCurrentEmployeeNamesIds(); 
        let roleObjectsArr= await sqlQueries.getRoleNamesIds();
        let employees = this.getEmployeeNamesOnly(employeeObjectArr); 
        let roles = this.getRoleNamesOnly(roleObjectsArr);  
        inquirerPrompts.askUpdateRoleQuestions(employees, roles).then(function(answers){
            sqlQueries.updateEmployeeRoleSql(employeeObjectArr, roleObjectsArr, answers, startSession); 
        })
    }
    
    async updateEmployeeManagerMain(startSession){
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds();
        let managerObjectArr = employeeObjectArr;
        managerObjectArr.push({name: "none", id: null}); 
        let employees = this.getEmployeeNamesOnly(employeeObjectArr); 
        let managers= this.getEmployeeNamesOnly(managerObjectArr); 
        inquirerPrompts.askUpdateMangerQuestions(employees, managers).then(function(answers){
            sqlQueries.updateEmployeeManagerSql(employeeObjectArr, managerObjectArr, answers, startSession); 
        })
    }
    
    //helper functions
    getDepartmentNamesOnly(departmentObjectsArr){
        let departmentNamesArr= [];
        for (const department of departmentObjectsArr){
            departmentNamesArr.push(department.name); 
        }
        return departmentNamesArr; 
    }
    
    getEmployeeNamesOnly(employeeObjectArr){
        let employeeNamesArr = []; 
        for (const employee of employeeObjectArr){
            employeeNamesArr.push(employee.name); 
        }
        return employeeNamesArr; 
    }
    
    getRoleNamesOnly(roleObjectsArr){
        let roleNamesArr= [];
        for (const role of roleObjectsArr){
            roleNamesArr.push(role.title); 
        }
        return roleNamesArr; 
    }
}

module.exports= EmployeeTracker; 