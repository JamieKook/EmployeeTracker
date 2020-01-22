const mysql = require("mysql"); 
const inquirer= require("inquirer"); 
const cTable = require("console.table")
const joinTables = "SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary FROM employee as E JOIN role as R on E.role_id = R.id JOIN department as D on D.id = R.department_id"; 

class EmployeeTracker {
    constructor(){

    }

    startSession() {
        console.log("Welcome to the Employee Tracker!");
        this.mainAsk().then(function(choice){
            console.log(choice); 
            let {action} = choice; 
            console.log(action); 
            switchUserChoice(action); 
            }
        )
    }

    mainAsk() {
        return inquirer
            .prompt(
                [
                    {type: "list", 
                    name: "action", 
                    message: "What would you like to do?", 
                    choices:
                        ["View All Employees" , 
                        "View All Employees By Department", 
                        "View All Employees By Manager", 
                        "Add Employee",
                        "Remove Employee",
                        "Update Employee Role",
                        "Update Employee Manager"
                        ]
                    }
                ]
            );
    }

    switchUserChoice(action){
        switch (action) {
            case "View All Employees": 
                this.viewAllData(); 
                break; 
            case "View All Employees By Department": 
                viewByDepartment();
                break;  
            default:
                console.log("We don't have that functionality yet. Sorry."); 
        }
    }
    

    
    
    // function askDepartment(){
    //     return inquirer
    //         .prompt(
    //             [
    //                 {type: "list",
    //                 name: "departmentChoice",
    //                 message: "Which department would you like to view?",
    //                 choices:
    //                     ["Sales",
    //                     "Engineering",
    //                     "Finance",
    //                     "Legal"
    //                     ]
    //                 }
    //             ]
    //         ); 
    // }
    
    viewAllData() {
        connection.query(joinTables, function(err, res) {
          if (err) throw err;
          console.table(res); 
        });
    }
    
    // async function viewByDepartment(){
    //     connection.query("SELECT name FROM department", async function(err,res){
    //         if (err) throw err; 
    //         console.log(res); 
    //         let choice = await askDepartment(); 
    //         console.log(choice); 
    //     }); 
    // }
}

module.exports= EmployeeTracker; 