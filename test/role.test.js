const Role = require("../lib/role");

/////--------------------- Initializers

test ("Should use paramters to create properties", () =>{ 
    const r = new Role( "rolename",200, "department"); 
    expect(r.name).toBe("Rolename"); 
    expect(r.salary).toBe(200);
    expect(r.departmentName).toBe("department");
    expect(r.isValid).toBe(true); 
  });

test ("Should return false for isValid if an empty string is entered as the name", () =>{ 
    const r = new Role("",200); 
    expect(r.isValid).toBe(false); 
  });

test ("Should return false for isValid if a undefined value is entered as the name", () =>{ 
    const r = new Role( undefined, 200); 
    expect(r.isValid).toBe(false); 
}); 

test ("Should return false for isValid if numbers are entered as part of the name", () =>{ 
    const r = new Role( "name1",200); 
    expect(r.isValid).toBe(false); 
  });

test ("Should return false for isValid if special characters are entered as part of the name", () =>{ 
    const r = new Role( "name$", 200); 
    expect(r.isValid).toBe(false); 
  });

test ("Casing Fix should return a name with each separate word having a capitalized first letter and the rest of the letters uncapitalized", ()=>{
    const r = new Role( "multI wOrd title", 200);
    expect(r.name).toBe("Multi Word Title");   
}); 

test ("Should return false for isValid if an empty string is entered as the salary", () =>{ 
    const r = new Role("name", ""); 
    console.log(r.salary);
    expect(r.isValid).toBe(false); 
  });

test ("Should return false for isValid if a undefined value is entered as the salary", () =>{ 
    const r = new Role("name", undefined); 
    console.log(r.salary); 
    expect(r.isValid).toBe(false); 
});

test ("Should return false for isValid if a string is entered as the salary", () =>{ 
    const r = new Role("name", "one1"); 
    expect(r.isValid).toBe(false); 
});

////---------------------Methods
test ("getRoleId method should return correct id for inputted name", ()=>{
    const r = new Role( "Engineer", 100);
    const roleObjectArr = [{title: "first", id: 1}, {title: "Salesperson", id:2}, {title: "engineer", id: 3}]; 
    r.getRoleId(roleObjectArr)
    expect(r.id).toBe(3); 
}); 

test ("getRoleId method should return null if role is not in database", ()=>{
    const r = new Role( "Engineer", 100);
    const roleObjectArr = [{title: "first", id: 1}, {title: "Manager", id:2}, {title: "lawyer", id: 3}]; 
    r.getRoleId(roleObjectArr)
    expect(r.id).toBe(null); 
}); 

test ("checkForDuplicates method should return true if a role with that name is already in the database", ()=>{
    const r = new Role( "Engineer", 100);
    const roleObjectArr = [{title: "first", id: 1}, {title: "Engineer", id:2}, {title: "engineer", id: 3}];
    r.checkForDuplicates(roleObjectArr); 
    expect(r.isDuplicate).toBe(true); 
}); 

test ("checkForDuplicates method should return false if it's a new role", ()=>{
    const r = new Role( "Engineer", 100);
    const roleObjectArr = [{title: "first", id: 1}, {title: "Manager", id:2}, {title: "engineer", id: 3}]; 
    r.checkForDuplicates(roleObjectArr); 
    expect(r.isDuplicate).toBe(false); 
}); 

test ("getDepartmentId should find the role's department Id from a database", ()=>{
    const r = new Role( "Engineer", 100, "Engineering");
    const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
    r.getDepartmentId(departmentObjectArr); 
    expect(r.departmentId).toBe(1); 
});

test ("checkUpdatedDepartment should return true if the role's department was changed", ()=>{
    const r = new Role( "Engineer", 100);
    r.departmentId= 4; 
    const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}]; 
    r.getRoleId(roleObjectArr); 
    r.checkUpdatedDepartment(roleObjectArr); 
    expect(r.isUpdated).toBe(true); 
});

test ("checkUpdatedDepartment should return false if the role's department was unchanged", ()=>{
    const r = new Role( "Engineer", 100);
    const roleObjectArr = [{title: "first", id: 1, departmentId: 1}, {title: "Manager", id:2, departmentId: 1}, {title: "Engineer", id: 3, departmentId: 1}]; 
    r.getRoleId(roleObjectArr); 
    r.departmentId= 1;
    r.checkUpdatedDepartment(roleObjectArr); 
    expect(r.isUpdated).toBe(false); 
});

test ("checkForEmployees should return true if the role is held by employees", ()=>{
    const r = new Role( "Engineer", 100);
    r.id= 1; 
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 4}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:1, managerId: 4}]; 
    r.checkForEmployees(employeeObjectArr); 
    expect(r.hasEmployees).toBe(true); 
});

test ("checkForEmployees should return false if the role is not held by any employees", ()=>{
    const r = new Role( "Engineer", 100);
    r.id= 1;
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:3, managerId: 4}, {name: "Sue", id:2, roleId:3, managerId: 4}, {name: "Last", id: 3, roleId:4, managerId: 4}]; 
    r.checkForEmployees(employeeObjectArr); 
    expect(r.hasEmployees).toBe(false); 
});

test ("2- createStringOfEmployees should return a string of the employees that have that role", ()=>{
    const r = new Role( "Engineer", 100);
    r.id= 1;
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 2}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
    r.checkForEmployees(employeeObjectArr); 
    const string = r.createStringOfEmployees(employeeObjectArr); 
    expect(string).toBe(" First Last and Sue"); 
});

test ("1- createStringOfEmployees should return a string of the employees that have that role", ()=>{
    const r = new Role( "Engineer", 100);
    r.id= 1;
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:3, managerId: 2}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:2, managerId: 1}]; 
    r.checkForEmployees(employeeObjectArr); 
    const string = r.createStringOfEmployees(employeeObjectArr); 
    expect(string).toBe(" Sue"); 
});

test ("3- createStringOfEmployees should return a string of the employees that have that role", ()=>{
    const r = new Role( "Engineer", 100);
    r.id= 1;
    const employeeObjectArr = [{name: "First Last", id: 1, roleId:1, managerId: 2}, {name: "Sue", id:2, roleId:1, managerId: 1}, {name: "Last", id: 3, roleId:1, managerId: 1}]; 
    r.checkForEmployees(employeeObjectArr); 
    const string = r.createStringOfEmployees(employeeObjectArr); 
    expect(string).toBe(" First Last, Sue, and Last"); 
});