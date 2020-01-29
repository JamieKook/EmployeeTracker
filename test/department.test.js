const Department = require("../lib/department");

/////--------------------- Initializers

test ("Should use paramters to create properties", () =>{ 
    const d = new Department( "Name"); 
    expect(d.name).toBe("Name"); 
    expect(d.isValid).toBe(true); 
  });

test ("Should return false for isValid if an empty string is entered as name", () =>{ 
    const d = new Department( ""); 
    expect(d.isValid).toBe(false); 
  });

test ("Should return false for isValid if a undefined value is entered as the name", () =>{ 
    const d = new Department( undefined); 
    expect(d.isValid).toBe(false); 
}); 

test ("Should return false for isValid if numbers are entered as part of the name", () =>{ 
    const d = new Department( "name1"); 
    expect(d.isValid).toBe(false); 
  });

test ("Should return false for isValid if special characters are entered as part of the name", () =>{ 
    const d = new Department( "name;"); 
    expect(d.isValid).toBe(false); 
  });

test ("Casing Fix should return a name with each separate word having a capitalized first letter and the rest of the letters uncapitalized", ()=>{
    const d = new Department( "humAN reSources");
    expect(d.name).toBe("Human Resources"); 
}); 

////---------------------Methods
test ("getDepartmentId method should return correct id for inputted name", ()=>{
    const d = new Department( "Sales");
    const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
    d.getDepartmentId(departmentObjectArr)
    expect(d.id).toBe(2); 
}); 

test ("getDepartmentId method should return null if department is not in database", ()=>{
    const d = new Department( "Sales");
    const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Legal", id:2}, {name: "HR", id: 3}]; 
    d.getDepartmentId(departmentObjectArr)
    expect(d.id).toBe(null); 
}); 

test ("checkForDuplicates method should return true if a department with that name is already in the database", ()=>{
    const d = new Department( "Sales");
    const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Sales", id:2}, {name: "HR", id: 3}]; 
    d.getDepartmentId(departmentObjectArr) 
    d.checkForDuplicates(departmentObjectArr); 
    expect(d.isDuplicate).toBe(true); 
}); 

test ("checkForDuplicates method should return false if it's a new department", ()=>{
    const d = new Department( "Sales");
    const departmentObjectArr = [{name: "Engineering", id: 1}, {name: "Legal", id:2}, {name: "HR", id: 3}]; 
    d.getDepartmentId(departmentObjectArr); 
    d.checkForDuplicates(departmentObjectArr); 
    expect(d.isDuplicate).toBe(false); 
}); 

test ("checkForRoles should return true if the department contains roles", ()=>{
    const d = new Department( "Sales");
    d.id= 1; 
    const roleObjectArr = [{name: "Salesperson", id: 1, departmentId:1},{name: "Engineer", id: 2, departmentId:2}]; 
    d.checkForRoles(roleObjectArr); 
    expect(d.hasRoles).toBe(true); 
});

test ("checkForManager should return false if the employee does not manage other employees", ()=>{
    const d = new Department( "Sales");
    d.id= 1; 
    const roleObjectArr = [{title: "Lawyer", id: 1, departmentId:3},{title: "Engineer", id: 2, departmentId:2}]; 
    d.checkForRoles(roleObjectArr); 
    expect(d.hasRoles).toBe(false); 
});

test ("2- createStringOfRoles should return a string of the roles that department contains", ()=>{
    const d = new Department( "Sales");
    d.id= 1; 
    const roleObjectArr = [{title: "Salesperson", id: 1, departmentId:1},{title: "Engineer", id: 2, departmentId:2}, {title: "Sales Lead", id: 3, departmentId:1}]; 
    d.checkForRoles(roleObjectArr); 
    const string = d.createStringOfRoles(roleObjectArr); 
    expect(string).toBe(" Salesperson and Sales Lead"); 
});

test ("1- createStringOfRoles should return a string of the roles that department contains", ()=>{
    const d = new Department( "Sales");
    d.id= 1; 
    const roleObjectArr = [{title: "Salesperson", id: 1, departmentId:1},{title: "Engineer", id: 2, departmentId:2}, {title: "Lawyer", id: 3, departmentId:3}]; 
    d.checkForRoles(roleObjectArr); 
    const string = d.createStringOfRoles(roleObjectArr); 
    expect(string).toBe(" Salesperson"); 
});

test ("3- createStringOfRoles should return a string of the roles that department contains", ()=>{
    const d = new Department( "Sales");
    d.id= 1; 
    const roleObjectArr = [{title: "Salesperson", id: 1, departmentId:1},{title: "Engineer", id: 2, departmentId:2}, {title: "Sales Lead", id: 3, departmentId:1}, {title: "Sales Analyst", id: 3, departmentId:1}]; 
    d.checkForRoles(roleObjectArr); 
    const string = d.createStringOfRoles(roleObjectArr); 
    expect(string).toBe(" Salesperson, Sales Lead, and Sales Analyst"); 
});