class Department{
    constructor(departmentName){
        this.isValid= true;
        this.name = departmentName;
        this.id = null; 
        this.isDuplicate=null;
        this.hasRoles= null; 
        this.roles= []; 
        const alpha ="abcdefghijklmnopqrstuvwxyz ";
        //check if name is valid
        if (this.name === undefined || this.name === ""){
            console.log("\nYou must enter a department name!"); 
            this.isValid=false; 
        } else {
            for (const letter of this.name.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            if (!this.isValid){
                console.log("\nYou can only use letters in the department's name."); 
                }
            }

            if (this.isValid){
                this.name= this.casingFix(this.name); 
            }
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
    
    checkForDuplicates(departmentObjectArr){ 
        for (const department of departmentObjectArr){
            if (this.casingFix(department.name) === this.name){
                this.isDuplicate=true; 
                console.log("\nOh No! You already have a department with the same name in your database. \n\nIf this is not in error, please add again with a distinct name.\n"); 
                return; 
            } 
            this.isDuplicate= false; 
        }
    }

    getDepartmentId(departmentObjectArr){
        for (const department of departmentObjectArr){
            if (this.casingFix(department.name) === this.name){
                this.id = department.id; 
            }
        }
    }

    checkForRoles(roleObjectArr){
        for (const role of roleObjectArr){
            if (role.departmentId === this.id){
                this.hasRoles= true; 
                this.roles.push(role.title); 
            }
        }
        if (this.hasRoles){
            return; 
        } else {
            this.hasRoles= false; 
        }
    }

    createStringOfRoles(){
        let roleString = ""; 
        let numRoles= this.roles.length; 
        for (let i=0; i<numRoles; i++){
            if (i <numRoles -1){
                if (numRoles >2){
                    roleString += ` ${this.roles[i]},`; 
                } else {
                    roleString += ` ${this.roles[i]}`; 
                }
            } else if( numRoles>1){
                roleString +=` and ${this.roles[i]}`; 
            } else {
                roleString +=` ${this.roles[i]}`; 
            }
        }
        return roleString; 
    }

    
} 

module.exports = Department; 

   
