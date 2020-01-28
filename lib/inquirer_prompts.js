const inquirer= require("inquirer"); 

class InquirerPrompts {
    constructor(){
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
                        "Update Employee Manager",
                        "View All Departments",
                        "Add Department",
                        "Remove Department",
                        "View All Roles",
                        "View All Roles By Department",
                        "Add Role",
                        "Remove Role",
                        "End Session"
                        ]
                    }
                ]
            );
    }
    
    askDepartment(names){
        return inquirer
            .prompt(
                [
                    {type: "list",
                    name: "departmentChoice",
                    message: "Which department would you like to view?",
                    choices: names
                    }
                ]
            ); 
    }

    askManager(names){
        return inquirer
        .prompt(
            [
                {type: "list",
                name: "managerChoice",
                message: "Which manager would you like to view?",
                choices: names
                }
            ]
        ); 
    }

    askNewEmployeeQuestions(roles, managers){
        const newEmployeeQuestions= [
            {type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
            },
            {type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
            },
            {type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles
            },
            {type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managers
            }
        ]; 
        return inquirer
            .prompt(newEmployeeQuestions); 
    }

    askRemoveEmployeeQuestions(employeeNames){
        return inquirer
            .prompt(
                [
                    {type: "list",
                    name: "employeeToRemove",
                    message: "Which employee do you want to remove?",
                    choices: employeeNames
                    }
                ]
            )
    }

    askUpdateRoleQuestions(employees, roles) {
        const updateRoleQuestions= [
            {type: "list",
            name: "employeeToUpdate",
            message: "Which employee's role do you want to update?",
            choices: employees
            },
            {type: "list",
            name: "newRole",
            message: "What is the employee's new role?",
            choices: roles
            }
        ]; 
        return inquirer
            .prompt(updateRoleQuestions); 
    }

    askUpdateMangerQuestions(employees, managers){
        const updateRoleQuestions= [
            {type: "list",
            name: "employeeToUpdate",
            message: "Which employee's manager do you want to update?",
            choices: employees
            },
            {type: "list",
            name: "newManager",
            message: "Who is the employee's new manager?",
            choices: managers
            }
        ]; 
        return inquirer
            .prompt(updateRoleQuestions); 
    }

    askNewDepartmentQuestions(){
        return inquirer
            .prompt(
                [
                    {type: "input",
                    name: "newDepartment",
                    message: "What is the name of the department you want to add?"
                    }
                ]
            )
    }

    askRemoveDepartmentQuestions(departmentNames){
        return inquirer
            .prompt(
                [
                    {type: "list",
                    name: "departmentToRemove",
                    message: "Which department do you want to remove?",
                    choices: departmentNames
                    }
                ]
            )
    }

    askNewRoleQuestions(departmentNames){
        return inquirer
            .prompt(
                [
                    {type: "input",
                    name: "newRole",
                    message: "What is the name of the role you want to add?"
                    },
                    {type: "input",
                    name: "salary",
                    message: "What salary does this role earn?"
                    },
                    {type: "list",
                    name: "department",
                    message: "Which department will the role be in?",
                    choices: departmentNames
                    }

                ]
            )
    }

    askRemoveRoleQuestions(roleNames){
        return inquirer
            .prompt(
                [
                    {type: "list",
                    name: "roleToRemove",
                    message: "Which role do you want to remove?",
                    choices: roleNames
                    }
                ]
            )
    }
}

module.exports= InquirerPrompts; 