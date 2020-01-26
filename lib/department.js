class Department{
    constructor(departmentName){
        this.isValid= true;
        this.name = departmentName;
        this.isDuplicate=false;
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

    casingFix(name) {
        let namearr= name.split(""); 
        let nameLetter=namearr[0].toUpperCase(); 
        namearr.splice(0,1);
        let nameRest= namearr.join("").toLowerCase(); 
        let casedName= nameLetter+nameRest
        return casedName; 
    }
    
    checkForDuplicates(currentDepartments){ 
        for (const department of currentDepartments){
            if (department.name === this.name){
                this.isDuplicate=true; 
                console.log("\nOh No! You already have a department with the same name in your database. \n\nIf this is not in error, please add again with a distinct name.\n"); 
                return; 
            } 
            this.isDuplicate= false; 
        }
    }
} 

module.exports = Department; 

   
