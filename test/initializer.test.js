const Initializer = require("../lib/initialize");
const i = new Initializer(); 

describe("Initializer Methods", () => {
    describe("getDepartmentNamesOnly method", () => {
      it("returns an array of names", () => {
        const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
        const names= i.getDepartmentNamesOnly(departmentObjectArr); 
        expect(names).toStrictEqual(["Engineering", "Sales", "HR"]);
        });
    });
    describe("getEmployeNamesOnly method", () => {
        it("returns an array of names", () => {
        const employeeObjectArr = [{name: "First Last", id: 1, roleId:3, managerId: 2}, {name: "Sue Peterson", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
        const names= i.getEmployeeNamesOnly(employeeObjectArr); 
        expect(names).toStrictEqual(["First Last", "Sue Peterson", "Last"]);
        });
    });
    describe("getRoleNamesOnly method", () => {
        it("returns an array of names", () => {
        const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}]; 
        const names= i.getRoleNamesOnly(roleObjectArr); 
        expect(names).toStrictEqual(["first", "Manager", "Engineer"]);
        });
    });
    describe("splitName method", () => {
        it("returns an object of first and last names", () => {
        const name = "Sue Peterson"; 
        const nameObject= i.splitName(name); 
        expect(nameObject).toStrictEqual({firstName: "Sue", lastName: "Peterson"});
        });
    });
    describe("initializeNewEmployee method", () => {
        it("when valid data entered, returns an employee object with name, roleId, managerId, isValid, and isDuplicate properties", () => {
            const answers= {firstName: "Sue", lastName: "Peterson", role: "Engineer", manager: "Bob Robertson"}; 
            const employeeObjectArr = [{name: "Bob Robertson", id: 1, roleId:3, managerId: 2}, {name: "Brenda Tom", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}]; 
            const employee = i.initializeNewEmployee(answers, employeeObjectArr, roleObjectArr); 
            expect(employee.isValid).toBe(true); 
            expect(employee.isDuplicate).toBe(false); 
            expect(employee.firstName).toBe("Sue"); 
            expect(employee.lastName).toBe("Peterson"); 
            expect(employee.roleId).toBe(3); 
            expect(employee.managerId).toBe(1); 
        });
    });
    describe("initializeRemoveEmployee method", () => {
        it("when valid data entered, returns an employee object with firstName, lastName, fullName, and isManager properties", () => {
            const answer= {employeeToRemove: "Sue Peterson"}; 
            const employeeObjectArr = [{name: "Bob Robertson", id: 1, roleId:3, managerId: 1}, {name: "Sue Peterson", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
            const employee = i.initializeRemovedEmployee(answer, employeeObjectArr); 
            expect(employee.isValid).toBe(true); 
            expect(employee.firstName).toBe("Sue"); 
            expect(employee.lastName).toBe("Peterson"); 
            expect(employee.fullName).toBe("Sue Peterson"); 
            expect(employee.isManager).toBe(false); 
        });
    });
    describe("initializeUpdatedRoleEmployee method", () => {
        it("when valid data entered, returns an employee object with fullName, id, roldId, roleTitle, idUpdated properties", () => {
            const answers= {employeeToUpdate: "Bob Robertson", newRole: "Manager"}; 
            const employeeObjectArr = [{name: "Bob Robertson", id: 1, roleId:3, managerId: 1}, {name: "Sue Peterson", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}]; 
            const employee = i.initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectArr); 
            expect(employee.isValid).toBe(true); 
            expect(employee.fullName).toBe("Bob Robertson"); 
            expect(employee.id).toBe(1); 
            expect(employee.roleId).toBe(2); 
            expect(employee.roleTitle).toBe("Manager");
            expect(employee.isUpdated).toBe(true); 
        });
    });
    describe("initializeUpdatedManagerEmployee method", () => {
        it("when valid data entered, returns an employee object with fullName, id, roldId, roleTitle, idUpdated properties", () => {
            const answers= {employeeToUpdate: "Bob Robertson", newRole: "Manager"}; 
            const employeeObjectArr = [{name: "Bob Robertson", id: 1, roleId:3, managerId: 1}, {name: "Sue Peterson", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}]; 
            const employee = i.initializeUpdatedRoleEmployee(answers, employeeObjectArr, roleObjectArr); 
            expect(employee.isValid).toBe(true); 
            expect(employee.fullName).toBe("Bob Robertson"); 
            expect(employee.id).toBe(1); 
            expect(employee.roleId).toBe(2); 
            expect(employee.roleTitle).toBe("Manager");
            expect(employee.isUpdated).toBe(true); 
        });
    });
    describe("initializeUpdatedManagerEmployee method", () => {
        it("when valid data entered, returns an employee object with fullName, id, managerId, managerName, idUpdated properties", () => {
           const answers= {employeeToUpdate: "Sue Peterson", newManager:"Last"}; 
           const employeeObjectArr = [{name: "Bob Robertson", id: 1, roleId:3, managerId: 1}, {name: "Sue Peterson", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
           let managerObjectArr = employeeObjectArr.map(object => object);
           managerObjectArr.push({name: "none", id: null}); 
           const e = i.initializeUpdatedManagerEmployee(answers, employeeObjectArr, managerObjectArr); 
           expect (e.isValid).toBe(true); 
           expect (e.fullName).toBe("Sue Peterson"); 
           expect (e.id).toBe(2); 
           expect (e.managerId).toBe(3); 
           expect (e.managerName).toBe("Last"); 
           expect (e.isUpdated).toBe(true); 
        });
    });
    describe("initializeViewDepartment method", () => {
        it("when valid data entered, returns a department object with id properties", () => {
           const answer = {departmentChoice: "Sales"}; 
           const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
            const d = i.initializeViewDepartment(answer, departmentObjectArr);
            expect (d.id).toBe(2); 
        });
    });
    describe("initializeNewDepartment method", () => {
        it("when valid data entered, returns a department object with name, isValid, and isDuplicate properties", () => {
            const answer = {newDepartment: "sales"}; 
            const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
            const d = i.initializeNewDepartment(answer, departmentObjectArr);
            expect (d.name).toBe("Sales"); 
            expect (d.isValid).toBe(true); 
            expect (d.isDuplicate).toBe(true); 
        });
    });
    describe("initializeRemovedDepartment method", () => {
        it("when valid data entered, returns a department object with name, id, and hasRoles", () => {
            const answer = {departmentToRemove: "sales"}; 
            const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}];
            const d = i.initializeRemovedDepartment(answer, departmentObjectArr, roleObjectArr);
            expect (d.name).toBe("Sales"); 
            expect (d.isValid).toBe(true); 
            expect (d.id).toBe(2); 
            expect (d.hasRoles).toBe(false); 
        });
    });
    describe("initializeNewRole method", () => {
        it("when valid data entered, returns a role object with name, salary, departmentId, isValid, and isDuplicate", () => {
            const answers = {newRole: "Hiring managEr", salary: "100000  ", department: "human reSources"}; 
            const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HumAn Resources", id: 3}]; 
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}];
            const r = i.initializeNewRole(answers, roleObjectArr, departmentObjectArr);
            expect (r.name).toBe("Hiring Manager"); 
            expect (r.salary).toBe(100000); 
            expect (r.departmentId).toBe(3);
            expect (r.isValid).toBe(true);
            expect (r.isDuplicate).toBe(false); 
        });
    });
    describe("initializeRemovedRole method", () => {
        it("when valid data entered, returns a role object with name, id, and hasEmployees", () => {
            const answer = {roleToRemove: "fiRst"}; 
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}];
            const employeeObjectArr = [{name: "Bob Robertson", id: 1, roleId:3, managerId: 1}, {name: "Sue Peterson", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
            const r = i.initializeRemovedRole(answer, roleObjectArr, employeeObjectArr);
            expect (r.name).toBe("First"); 
            expect (r.id).toBe(1);
            expect (r.hasEmployees).toBe(true);
        });
    });
    describe("initializeUpdatedDepartmentRole method", () => {
        it("when valid data entered, returns a role object with name, departmentName, departmentId, and isUpdated", () => {
            const answers = {roleToUpdate: "Manager", newDepartment: "Sales"};  
            const roleObjectArr = [{title: "first", id: 1, departmentId: 1, salary: 10}, {title: "Manager", id:2, departmentId: 1, salary: 30}, {title: "Engineer", id: 3, departmentId: 1, salary: 20}];
            const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HumAn Resources", id: 3}]; 
            const r = i.initializeUpdatedDepartmentRole(answers, roleObjectArr, departmentObjectArr);
            expect (r.name).toBe("Manager"); 
            expect (r.departmentName).toBe("Sales");
            expect (r.departmentId).toBe(2);
            expect (r.isUpdated).toBe(true); 
        });
    });
}); 

