class Role{
    constructor(roleName, salary, department){
        this.isValid= true;
        this.name = roleName;
        this.id = null; 
        this.salary = salary || null; 
        this.departmentName = department || null; 
        this.departmentId = null; 
        this.isDuplicate=false;
        this.isUpdated = false; 
        this.hasEmployees= null; ;
        this.employees= []; 
        const alpha ="abcdefghijklmnopqrstuvwxyz ";
        const numeric = "0123456789"; 
        
        //check if name is valid
        if (this.name === undefined || this.name === ""){
            console.log("\nYou must enter a role name!"); 
            this.isValid=false; 
        } else {
            for (const letter of this.name.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            if (!this.isValid){
                console.log("\nYou can only use letters in the role's name."); 
                }
            }

            if (this.isValid){
                this.name= this.casingFix(this.name); 
            }
        }

        if (this.salary === undefined || this.name === "" || this.salary === null){
            console.log("\nYou must enter a salary!"); 
            this.isValid=false; 
        } else if (isNaN(this.salary)){
                this.isValid=false; 
        }


        if (!this.isValid){
            console.log("\nYou can only use numbers in the salary."); 
        }
    }
    
    casingFix(name){
        let namesarr= name.split(" "); 
        let casedNames = []; 
        for (const name of namesarr){
            let namearr= name.split(""); 
            let nameLetter=namearr[0].toUpperCase(); 
            namearr.splice(0,1);
            let nameRest= namearr.join("").toLowerCase(); 
            let casedName= nameLetter+nameRest
            casedNames.push(casedName); 
        }
        
        return casedNames.join(" "); 
    }
    
    checkForDuplicates(roleObjectArr){ 
        for (const role of roleObjectArr){
            if (role.title === this.name){
                this.isDuplicate=true; 
                console.log("\nOh No! You already have a role with the same name in your database. \n\nIf this is not in error, please add again with a distinct name.\n"); 
                return; 
            } 
            this.isDuplicate= false; 
        }
    }

    getRoleId(roleObjectArr){
        for (const role of roleObjectArr){
            role.title= this.casingFix(role.title); 
            if (role.title === this.name){
                this.id = role.id; 
            }
        }
    }

    getDepartmentId(departmentObjectArr){
        for (const department of departmentObjectArr){
            if (department.name === this.departmentName){
                this.departmentId = department.id; 
            }
        }
    }

    checkForEmployees(employeeObjectArr){
        for (const employee of employeeObjectArr){
            if (employee.roleId === this.id){
                this.hasEmployees= true; 
                this.employees.push(employee.name); 
            }
        }
        if (this.hasEmployees){
            return; 
        } else {
            this.hasEmployees= false; 
        }
    }

    createStringOfEmployees(){
        let employeeString = ""; 
        let numEmployees= this.employees.length; 
        for (let i=0; i<numEmployees; i++){
            if (i <numEmployees -1){
                if (numEmployees >2){
                    employeeString += ` ${this.employees[i]},`; 
                } else {
                    employeeString += ` ${this.employees[i]}`; 
                }
            } else if( numEmployees>1){
                employeeString +=` and ${this.employees[i]}`; 
            } else {
                employeeString +=` ${this.employees[i]}`; 
            }
        }
        return employeeString; 
    }

    checkUpdatedDepartment(roleObjectArr){
        let nonupdatedRoleObject = roleObjectArr.find(oldRole => oldRole.id === this.id); 
        let previousDepartmentId = nonupdatedRoleObject.departmentId; 
        if (previousDepartmentId !== this.departmentId){
            this.isUpdated = true; 
        }
    }
} 

module.exports = Role; 

   
