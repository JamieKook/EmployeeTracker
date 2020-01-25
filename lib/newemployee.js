class NewEmployee{
    constructor(firstName, lastName){
        this.isDuplicate= false,
        this.isValid= true, 
        this.firstName= firstName,
        this.lastName= lastName

        const alpha ="abcdefghijklmnopqrstuvwxyz ";

        if (this.firstName === undefined || this.firstName === ""){
            console.log("\nYou must enter a first name!"); 
            this.isValid=false; 
        } else {
            for (const letter of this.firstName.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            }
            if (!this.isValid){
                console.log("\nYou can only use letters in the employee name."); 
            }
        }

        if (this.lastName === undefined || this.lastName === ""){
            console.log("\nYou must enter a last name!"); 
            this.isValid=false; 
        } else {
            for (const letter of this.lastName.toLowerCase()){
                if (alpha.indexOf(letter) === -1){
                    this.isValid=false; 
                }
            }
            if (!this.isValid){
                console.log("\nYou can only use letters in the employee name."); 
            }
        }

        this.firstName= this.casingFix(this.firstName); 
        this.lastName= this.casingFix(this.lastName); 
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
        let fullName= `${this.firstName} ${this.lastName}`; 
        for (const employee of currentEmployees){
            if (employee === fullName){
                this.isDuplicate=true; 
                console.log("\nOh No! You already have an employee with the same name in your database. \n\nIf this is not in error, please add again with a distinct name.\n\nEmployee was NOT added to the database.\n"); 
            }
        }
    }
}

module.exports= NewEmployee; 

