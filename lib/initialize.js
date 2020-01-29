const Employee= require("./newemployee"); 
const Department = require("./department");
const Role = require("./role"); 

class Initializer {
    constructor(){
    }

    //helper functions
//Get names from arrays
    getDepartmentNamesOnly(departmentObjectArr){
        let departmentNamesArr= [];
        for (const department of departmentObjectArr){
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

    getRoleNamesOnly(roleObjectArr){
        let roleNamesArr= [];
        for (const role of roleObjectArr){
            roleNamesArr.push(role.title); 
        }
        return roleNamesArr; 
    }

    splitName(name){
        let firstName= name.split(" ")[0];
        let lastName=  name.split(" ")[1];
        return {firstName: firstName, lastName: lastName}; 
    }

    //Initialize Objects
    //Employees
    initializeNewEmployee(answers, employeeObjectArr, roleObjectArr){
        const employee= new Employee(answers.firstName.trim(), answers.lastName.trim(), null, answers.role, answers.manager);
        employee.getEmployeeId(employeeObjectArr);
        employee.getRoleId(roleObjectArr);
        employee.getManagerId(employeeObjectArr); 
        employee.checkForDuplicates(employeeObjectArr); 
        return employee; 
    }

    initializeRemovedEmployee(answer, employeeObjectArr){
        let employeeName= this.splitName(answer.employeeToRemove); 
        let employee = new Employee(employeeName.firstName, employeeName.lastName);
        employee.checkForManager(employeeObjectArr); 
        return employee; 
    }

    initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectArr){
        let employeeName = this.splitName(answers.employeeToUpdate); 
        const employee = new Employee(employeeName.firstName, employeeName.lastName, null, answers.newRole); 
        employee.getEmployeeId(employeeObjectArr); 
        employee.getRoleId(roleObjectArr); 
        employee.checkUpdatedRole(employeeObjectArr); 
        return employee; 
    }

    initializeUpdatedManagerEmployee(answers,employeeObjectArr, managerObjectArr){
        let employeeName = this.splitName(answers.employeeToUpdate); 
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
    initializeViewDepartment(answer, departmentObjectArr){
        const department = new Department(answer.departmentChoice); 
        department.getDepartmentId(departmentObjectArr);
        return department; 
    }

    initializeNewDepartment(answer, departmentObjectArr){
        let {newDepartment} = answer; 
        const department = new Department(newDepartment.trim()); 
        department.checkForDuplicates(departmentObjectArr); 
        return department; 
    }

    initializeRemovedDepartment(answer, departmentObjectArr, roleObjectArr){
        let {departmentToRemove} = answer; 
        const department = new Department(departmentToRemove);
        department.getDepartmentId(departmentObjectArr); 
        department.checkForRoles(roleObjectArr);
        return department; 
    }

    //Roles
    initializeNewRole(answers, roleObjectArr, departmentObjectArr){
        const role = new Role(answers.newRole.trim(), answers.salary, answers.department); 
        role.checkForDuplicates(roleObjectArr);
        role.getDepartmentId(departmentObjectArr);  
        return role; 
    }

    initializeRemovedRole(answer, roleObjectArr, employeeObjectArr){
        const role = new Role(answer.roleToRemove);
        role.getRoleId(roleObjectArr);
        console.log(role.id);  
        role.checkForEmployees(employeeObjectArr);
        return role; 
    }

    initializeUpdatedDepartmentRole(answers, roleObjectArr, departmentObjectArr){
        let roleObject = roleObjectArr.find(role => role.title === answers.roleToUpdate); 
        console.log(roleObject); 
        const role = new Role (answers.roleToUpdate, roleObject.salary, answers.newDepartment); 
        role.getRoleId(roleObjectArr); 
        role.getDepartmentId(departmentObjectArr); 
        role.checkUpdatedDepartment(roleObjectArr); 
        return role; 
    }

}

module.exports= Initializer; 