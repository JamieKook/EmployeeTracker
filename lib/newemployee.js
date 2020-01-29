class Employee{
    constructor(firstName, lastName, id, roleTitle, managerName){
        this.isValid= true; 
        const alpha ="abcdefghijklmnopqrstuvwxyz ";
        //check if name is valid
        if (firstName === undefined || firstName === ""){
            console.log("\nYou must enter a first name!"); 
            this.isValid=false; 
        } else if(this.isValid){
            for (const letter of firstName.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            }
            if (!this.isValid){
                console.log("\nYou can only use letters in the employee's name."); 
            }
        }

        if (lastName === undefined || lastName === ""){
            console.log("\nYou must enter a last name!"); 
            this.isValid=false; 
        } else if(this.isValid) {
            for (const letter of lastName.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            }
            if (!this.isValid){
                console.log("\nYou can only use letters in the employee name."); 
            }
        }

        if (this.isValid){
            this.firstName= this.casingFix(firstName); 
            this.lastName= this.casingFix(lastName);
            this.fullName = `${this.firstName} ${this.lastName}`;
        }

        this.id = id || null;
        this.roleId = null;  
        this.roleTitle= roleTitle ||null; 
        this.managerId= null; 
        this.managerName= managerName || null; 
        this.isDuplicate= null; 
        this.isUpdated= null; 
        this.isManager= null; 
        this.employees = []; 

        if (this.roleTitle) {
            this.roleTitle = this.casingFix(this.roleTitle); 
        }

        if (this.managerName){
            this.managerName = this.casingFix(this.managerName); 
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



    getEmployeeId(employeeObjectArr){
        for (const employee of employeeObjectArr){
            employee.name = this.casingFix(employee.name); 
            if (employee.name === this.fullName){
                this.id = employee.id; 
            }
        }
    }

    checkForDuplicates(employeeObjectArr){ 
        for (const employee of employeeObjectArr){
            employee.name = this.casingFix(employee.name); 
            if (employee.name === this.fullName){
                this.isDuplicate=true; 
                console.log("\nOh No! You already have a employee with the same name in your database. \n\nIf this is not in error, please add again with a distinct name.\n"); 
                return; 
            } 
            this.isDuplicate= false; 
        }
    }
    

    getRoleId (roleObjectsArr){
        let roleObject= roleObjectsArr.find(role => this.casingFix(role.title) === this.roleTitle); 
        this.roleId= roleObject.id; 
    }

    // getRoleTitle(roleObjectArr){
    //     for (const role of roleObjectArr){
    //         if (role.id === this.roleId){
    //             this.roleTitle=role.title; 
    //         }
    //     }
    // }

    checkUpdatedRole(employeeObjectArr){
        let nonupdatedEmployeeObject = employeeObjectArr.find(oldEmployee => oldEmployee.id === this.id); 
        let previousRoleId = nonupdatedEmployeeObject.roleId; 
        if (previousRoleId !== this.roleId){
            this.isUpdated = true; 
        } else {
            this.isUpdated = false; 
        }
    }

    getManagerId (employeeObjectArr){
        let employeeObject= employeeObjectArr.find(employee => this.casingFix(employee.name) === this.managerName); 
        this.managerId= employeeObject.id; 
    }

    checkUpdatedManager(employeeObjectArr){
        let nonupdatedEmployeeObject = employeeObjectArr.find(oldEmployee => oldEmployee.id === this.id); 
        let previousManagerId = nonupdatedEmployeeObject.managerId; 
        if (previousManagerId !== this.managerId){
            this.isUpdated = true; 
        } else {
            this.isUpdated = false; 
        }
    }

    checkForManager(employeeObjectArr){
        this.getEmployeeId(employeeObjectArr); 
        for (const employee of employeeObjectArr){
            if (employee.managerId === this.id){
                this.isManager= true; 
                this.employees.push(employee.name); 
            }
        }
        if (this.isManager){
            return; 
        } else {
            this.isManager= false; 
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
}

module.exports= Employee; 

