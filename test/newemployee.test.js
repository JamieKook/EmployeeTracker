const Employee = require("../lib/newemployee");

/////--------------------- Initializers

test ("Should use paramters to create properties", () =>{ 
    const e = new Employee( "firstname", "lastname", 2, "roleTitle", "manager"); 
    expect(e.firstName).toBe("Firstname"); 
    expect(e.lastName).toBe("Lastname");
    expect(e.id).toBe(2);
    expect(e.roleTitle).toBe("roleTitle");
    expect(e.managerName).toBe("manager"); 
  });

test ("Should return false for isValid if an empty string is entered as the first name", () =>{ 
    const e = new Employee( "", "lastname", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
  });

test ("Should return false for isValid if a undefined value is entered as the first name", () =>{ 
    const e = new Employee( undefined, "lastname", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
}); 

test ("Should return false for isValid if an empty string is entered as the last name", () =>{ 
    const e = new Employee( "first", "", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
  });

test ("Should return false for isValid if a undefined value is entered as the last name", () =>{ 
    const e = new Employee( "first", undefined, 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
}); 

test ("Should return false for isValid if numbers are entered as part of the name", () =>{ 
    const e = new Employee( "name1", "lastname", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
  });

test ("Should return false for isValid if numbers are entered as part of the name", () =>{ 
    const e = new Employee( "name", "lastname2", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
});

test ("Should return false for isValid if special characters are entered as part of the name", () =>{ 
    const e = new Employee( "name", "lastname;", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
  });

test ("Should return false for isValid if special characters are entered as part of the name", () =>{ 
    const e = new Employee( "name!", "lastname", 2, "roleTitle", ""); 
    expect(e.isValid).toBe(false); 
});

test ("Should return true for isValid if both first and last names are entered", () =>{ 
    const e = new Employee( "first", "last", 1, "roleTitle", ""); 
    expect(e.isValid).toBe(true); 
    }); 

test ("Casing Fix should return a name with each separate word having a capitalized first letter and the rest of the letters uncapitalized", ()=>{
    const e = new Employee( "first", "laST", 1, "roleTitle", "");
    expect(e.firstName).toBe("First"); 
    expect(e.lastName).toBe("Last");  

}); 

test ("Should create full name using inputted first and last names", ()=>{
    const e = new Employee( "first", "laST", 1, "roleTitle", "");
    expect(e.fullName).toBe("First Last"); 
}); 


////---------------------Methods
test ("getEmployeeId method should return correct id for inputted name", ()=>{
    const e = new Employee( "First", "laST");
    const employeeObjectArr = [{name: "first", id: 1}, {name: "first laST", id:2}, {name: "First Last", id: 3}]; 
    e.getEmployeeId(employeeObjectArr)
    expect(e.id).toBe(3); 
}); 

test ("getEmployeeId method should return null if employee is not in database", ()=>{
    const e = new Employee( "first", "laST");
    const employeeObjectArr = [{name: "first", id: 1}, {name: "second", id:2}, {name: "Last", id: 3}]; 
    e.getEmployeeId(employeeObjectArr)
    expect(e.id).toBe(null); 
}); 

test ("checkForDuplicates method should return true if an employee with that name is already in the database", ()=>{
    const e = new Employee( "first", "laST");
    const employeeObjectArr = [{name: "first", id: 1}, {name: "first laST", id:2}, {name: "First Last", id: 3}]; 
    e.getEmployeeId(employeeObjectArr); 
    e.checkForDuplicates(employeeObjectArr); 
    expect(e.isDuplicate).toBe(true); 
}); 

test ("checkForDuplicates method should return false if it's a new employee", ()=>{
    const e = new Employee( "first", "laST");
    const employeeObjectArr = [{name: "first", id: 1}, {name: "first laST", id:2}, {name: "Last", id: 3}]; 
    e.getEmployeeId(employeeObjectArr); 
    e.checkForDuplicates(employeeObjectArr); 
    expect(e.isDuplicate).toBe(false); 
}); 

test ("getRoleId should find the employee's role Id from a database", ()=>{
    const e = new Employee( "first", "laST", 1, "engineer");
    const roleObjectArr = [{title: "salesperson", id: 1}, {title: "engineer", id:2}, {title: "Sales Lead", id: 3}]; 
    e.getRoleId(roleObjectArr); 
    expect(e.roleId).toBe(2); 
});

test ("checkUpdatedRole should return true if the employee's role was changed", ()=>{
    const e = new Employee( "first", "laST", 1, "engineer");
    e.roleId = 4; 
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1}, {name: "first laST", id:2, roleId:1}, {name: "Last", id: 3, roleId:1}]; 
    e.checkUpdatedRole(employeeObjectArr); 
    expect(e.isUpdated).toBe(true); 
});

test ("checkUpdatedRole should return false if the employee's role was unchanged", ()=>{
    const e = new Employee( "first", "laST", 1, "engineer");
    e.roleId = 4; 
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:4}, {name: "first laST", id:2, roleId:1}, {name: "Last", id: 3, roleId:1}]; 
    e.checkUpdatedRole(employeeObjectArr); 
    expect(e.isUpdated).toBe(false); 
});

test ("getManagerId should determine the id of the employee's manager", ()=>{
    const e = new Employee( "First", "Last", 1, "engineer", "Sue");
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1}, {name: "Sue", id:2, roleId:1}, {name: "Last", id: 3, roleId:1}]; 
    e.getManagerId(employeeObjectArr); 
    expect(e.managerId).toBe(2); 
});

test ("checkUpdatedManager should return true if the employee's manager changed", ()=>{
    const e = new Employee( "first", "laST", 1);
    e.managerId = 8; 
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 4}, {name: "Sue", id:2, roleId:1, managerId: 3}, {name: "Last", id: 3, roleId:1, managerId: 4}]; 
    e.checkUpdatedManager(employeeObjectArr); 
    expect(e.isUpdated).toBe(true); 
});

test ("checkUpdatedManager should return false if the employee's manager changed", ()=>{
    const e = new Employee( "first", "laST", 1);
    e.managerId = 4; 
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 4}, {name: "Sue", id:2, roleId:1, managerId: 3}, {name: "Last", id: 3, roleId:1, managerId: 4}]; 
    e.checkUpdatedManager(employeeObjectArr); 
    expect(e.isUpdated).toBe(false); 
});

test ("checkForManager should return true if the employee manages other employees", ()=>{
    const e = new Employee( "first", "laST", 1);
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 4}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:1, managerId: 4}]; 
    e.checkForManager(employeeObjectArr); 
    expect(e.isManager).toBe(true); 
});

test ("checkForManager should return false if the employee does not manage other employees", ()=>{
    const e = new Employee( "first", "laST", 1);
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 4}, {name: "Sue", id:2, roleId:1, managerId: 4}, {name: "Last", id: 3, roleId:1, managerId: 4}]; 
    e.checkForManager(employeeObjectArr); 
    expect(e.isManager).toBe(false); 
});

test ("2- createStringOfEmployees should return a string of the employees that employee manages", ()=>{
    const e = new Employee( "first", "laST", 1);
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 2}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:1, managerId: 1}]; 
    e.checkForManager(employeeObjectArr); 
    const string = e.createStringOfEmployees(employeeObjectArr); 
    expect(string).toBe(" Sue and Last"); 
});

test ("1- createStringOfEmployees should return a string of the employees that employee manages", ()=>{
    const e = new Employee( "first", "laST", 1);
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 2}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:1, managerId: 2}]; 
    e.checkForManager(employeeObjectArr); 
    const string = e.createStringOfEmployees(employeeObjectArr); 
    expect(string).toBe(" Sue"); 
});

test ("3- createStringOfEmployees should return a string of the employees that employee manages", ()=>{
    const e = new Employee( "first", "laST", 1);
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 1}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:1, managerId: 1}]; 
    e.checkForManager(employeeObjectArr); 
    const string = e.createStringOfEmployees(employeeObjectArr); 
    expect(string).toBe(" First Last, Sue, and Last"); 
});