class Employee{
    constructor(firstName, lastName, id, role){
        this.isValid= true; 
        this.firstName= firstName; 
        this.lastName= lastName; 
        this.fullName = `${this.firstName} ${this.lastName}`; 
        this.id = id || null;
        this.roleId = role || null;  
        this.roleTitle= null; 
        this.isDuplicate= null; 
        this.isManager= null; 
        this.employees = []; 
        ; 

        const alpha ="abcdefghijklmnopqrstuvwxyz ";

        if (this.firstName === undefined || this.firstName === ""){
            console.log("\nYou must enter a first name!"); 
            this.isValid=false; 
        } else if(this.isValid){
            for (const letter of this.firstName.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            }
            if (!this.isValid){
                console.log("\nYou can only use letters in the employee's name."); 
            }
        }

        if (this.lastName === undefined || this.lastName === ""){
            console.log("\nYou must enter a last name!"); 
            this.isValid=false; 
        } else if(this.isValid) {
            for (const letter of this.lastName.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            }
            if (!this.isValid){
                console.log("\nYou can only use letters in the employee name."); 
            }
        }

        if (this.isValid){
            this.firstName= this.casingFix(this.firstName); 
            this.lastName= this.casingFix(this.lastName);
        }
    }

    casingFix(name){
        let namearr= name.split(""); 
        let nameLetter=namearr[0].toUpperCase(); 
        namearr.splice(0,1);
        let nameRest= namearr.join("").toLowerCase(); 
        let casedName= nameLetter+nameRest
        return casedName; 
    }

    checkForDuplicates(currentEmployees){ 
        for (const employee of currentEmployees){
            if (employee === this.fullName){
                this.isDuplicate=true; 
                console.log("\nOh No! You already have an employee with the same name in your database. \n\nIf this is not in error, please add again with a distinct name.\n\nEmployee was NOT added to the database.\n"); 
                return; 
            } 
            this.isDuplicate= false; 
        }
    }

    getEmployeeId(employeeObjectArr){
        for (const employee of employeeObjectArr){
            if (employee.name === this.fullName){
                this.id = employee.id; 
            }
        }
    }

    getRoleTitle(roleObjectArr){
        for (const role of roleObjectArr){
            if (role.id === this.roleId){
                this.roleTitle=role.title; 
            }
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

