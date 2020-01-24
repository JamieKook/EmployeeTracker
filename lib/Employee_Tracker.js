const SqlQueries = require("./sql_queries"); 
const InquirerPrompts = require("./inquirer_prompts"); 

const sqlQueries = new SqlQueries; 
const inquirerPrompts = new InquirerPrompts; 

class EmployeeTracker {
    constructor(){
    }
    
    async startSession() {
        try{
            let answer = await inquirerPrompts.mainAsk(); 
            console.log(answer); 
            let {action} = answer;  
            console.log(action); 
            console.log(this); 
            this.switchUserChoice(action); 
        } catch (err){
            console.log(err); 
        }  
    }
    
    // async startSession() {
    //     let answer = await inquirerPrompts.mainAsk(); 
    //     console.log(answer); 
    //     let {action} = answer;  
    //     console.log(action); 
    //     switchUserChoice(action, startSession); 
    // }
    
    switchUserChoice(action){
        switch (action) {
            case "View All Employees": 
                sqlQueries.viewAllData(this.startSession); 
                break; 
            case "View All Employees By Department": 
                this.viewByDepartmentMain();
                break; 
            case "View All Employees By Manager":
                this.viewByManagerMain(); 
                break; 
            case "Add Employee": 
                this.addEmployee(); 
                break; 
            case "Remove Employee":
                this.removeEmployee(); 
                break; 
            case "Update Employee Role":
                this.updateEmployeeRoleMain(); 
                break; 
            case "Update Employee Manager": 
                this.updateEmployeeManagerMain(); 
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
    async viewByDepartmentMain(){
        let departmentObjectArr = await sqlQueries.getDepartmentNamesIds(); 
        let departmentNames = this.getDepartmentNamesOnly(departmentObjectArr); 
        let answer = await inquirerPrompts.askDepartment(departmentNames); 
        let {departmentChoice}= answer; 
        sqlQueries.getTableByDepartment(departmentChoice, this.startSession); 
    }
    
    async viewByManagerMain(){
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
        employeeObjectArr.push({name: "none", id: null});
        names = this.getEmployeeNamesOnly(employeeObjectArr); 
        inquirerPrompts.askManager(names).then(function(answer){
            let managerObject= employeeObjectArr.find(employee => employee.name === answer.managerChoice); 
            let manager_id = managerObject.id; 
            sqlQueries.getTableByManager(manager_id, this.startSession); 
        }); 
    }
    
    async addEmployee(){
        let roleObjectsArr= await sqlQueries.getRoleNamesIds();
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
        employeeObjectArr.push({name: "none", id: null});
        managers = this.getEmployeeNamesOnly(employeeObjectArr); 
        roles= this.getRoleNamesOnly(roleObjectsArr); 
        inquirerPrompts.askNewEmployeeQuestions(roles, managers).then( function(answers){
            sqlQueries.insertEmployeeData(roleObjectsArr, employeeObjectArr, answers, this.startSession); 
        });   
    }
    
    async removeEmployee(){
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds(); 
        let employeeNames= this.getEmployeeNamesOnly(employeeObjectArr); 
        inquirerPrompts.askRemoveEmployeeQuestions(employeeNames).then(function(answer){
            let {employeeToRemove} = answer; 
            let firstName= employeeToRemove.split(" ")[0];
            let lastName=  employeeToRemove.split(" ")[1];
            sqlQueries.removeEmployeeData(firstName, lastName, this.startSession);
        });  
    }
    
    async updateEmployeeRoleMain(){
        let employeeObjectArr= await sqlQueries.getCurrentEmployeeNamesIds(); 
        let roleObjectsArr= await sqlQueries.getRoleNamesIds();
        let employees = this.getEmployeeNamesOnly(employeeObjectArr); 
        let roles = this.getRoleNamesOnly(roleObjectsArr);  
        inquirerPrompts.askUpdateRoleQuestions(employees, roles).then(function(answers){
            sqlQueries.updateEmployeeRoleSql(employeeObjectArr, roleObjectsArr, answers, this.startSession); 
        })
    }
    
    async updateEmployeeManagerMain(){
        let employeeObjectArr = await sqlQueries.getCurrentEmployeeNamesIds();
        let managerObjectArr = employeeObjectArr;
        managerObjectArr.push({name: "none", id: null}); 
        let employees = this.getEmployeeNamesOnly(employeeObjectArr); 
        let managers= this.getEmployeeNamesOnly(managerObjectArr); 
        inquirerPrompts.askUpdateMangerQuestions(employees, managers).then(function(answers){
            sqlQueries.updateEmployeeManagerSql(employeeObjectArr, managerObjectArr, answers, this.startSession); 
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