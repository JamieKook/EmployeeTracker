const mysql = require("mysql");
const {MySQL} = require("mysql-promisify"); 
const cTable = require("console.table");
// const EmployeeTracker = require("./Employee_Tracker"); 
const joinTables = `SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary,CONCAT(EM.first_name, " ", EM.last_name) as manager
FROM employee as E 
LEFT JOIN role as R on E.role_id = R.id 
LEFT JOIN department as D on D.id = R.department_id
LEFT JOIN employee as EM on EM.id = E.manager_id`; 

// const employeeTracker = new EmployeeTracker(); 

const db= new MySQL({
    host: "localhost", 
    port: 3306,
    user: "jamie",
    password: "1234pass",
    database: "employee_tracker"
}); 

class SqlQueries{
    constructor(){
        
    }

    beginConnection(repeatfxn){
        console.log("Welcome to the Employee Tracker!");
        repeatfxn();   
    }

    endConnection(){
        db.end(); 
    }

    async viewAllData(repeatfxn) {
        try {
            const {results} = await db.query({
                sql: joinTables+ " ORDER BY E.id",
            }); 
            console.log("\n"); 
            console.table(results); 
            console.log("\n"); 
            repeatfxn(); 
        } catch (err){
            console.log(err); 
        }  
     }
    
    async getTableByDepartment(department, repeatfxn){
        try {
            const {results} = await db.query({
                sql: `${joinTables}
                 WHERE D.name = "${department}"
                  ORDER BY E.id`,
            }); 
            console.log("\n"); 
            console.table(results); 
            console.log("\n"); 
            repeatfxn(); 
        } catch (err){
            console.log(err); 
        }  
    }

    async getTableByManager(manager_id, repeatfxn){
        try{
            const {results} = await db.query({
                sql: `${joinTables} 
                    WHERE E.manager_id = "${manager_id}" 
                    ORDER BY E.id`,
            })
            console.log("\n"); 
            console.table(results);
            console.log("\n"); 
            repeatfxn(); 
        } catch (err) {
            console.log(err); 
        }
    }

    async getDepartmentNamesIds(){
        try{
            const {results} = await db.query({
                sql: "SELECT name, id FROM department",
            });  
            let departmentObjectArr= []; 
            for (const row of results){
                let departmentObject = {name: row.name,
                                        id: row.id}; 
                departmentObjectArr.push(departmentObject); 
            }
            return departmentObjectArr; 
        } catch(err){
            console.log(err); 
        } 
     }

     async getCurrentEmployeeData(){
        try{
            const {results} = await db.query({
                sql: "SELECT * FROM employee",
            });  
            let employeeObjectArr= []; 
            for (const row of results){
                let employeeObject = {name: `${row.first_name} ${row.last_name}`,
                                        id: row.id,
                                        roleId: row.role_id,
                                    managerId: row.manager_id}; 
                employeeObjectArr.push(employeeObject); 
            }
            return employeeObjectArr; 
        } catch(err){
            console.log(err); 
        } 
    }

    async getRoleNamesIds(){
        try {
            const {results} = await db.query({
                sql: "SELECT title, id FROM role",
            }); 
            let roleObjectsArr=[]; 
            for (const row of results){
                roleObjectsArr.push({title: row.title, id: row.id}); 
            }
            return roleObjectsArr; 
        } catch(err) {
            console.log(err); 
        }
    }

    async insertEmployeeData(roleObjectsArr, employeeObjectArr, data, employee, repeatfxn){
        let roleObject= roleObjectsArr.find(role => role.title === data.role); 
        let role_id= roleObject.id; 
        const managerObject = employeeObjectArr.find(employee => employee.name === data.manager); 
        let manager_id = managerObject.id; 
        try {
            const {results} = await db.query({
                sql: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES ("${employee.firstName}", "${employee.lastName}", ${role_id}, ${manager_id})`,
            }); 
            console.log("\n"); 
            console.log(`Added ${employee.firstName} ${employee.lastName} to the database`); 
            console.log("\n"); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async removeEmployeeData(employee, repeatfxn){
        try {
            await db.query({
                sql: `DELETE FROM employee WHERE first_name= "${employee.firstName}" AND last_name= "${employee.lastName}"`,
            }); 
            console.log("\n"); 
            console.log(`Removed ${employee.fullName} from the database`); 
            console.log("\n"); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async updateEmployeeRoleSql(employee, repeatfxn){
        try {
            await db.query({
                sql: `UPDATE employee 
                SET role_id = ${employee.roleId}
                WHERE id = ${employee.id}`,
            }); 
            console.log("\n"); 
            console.log( `Updated ${employee.fullName} to the new role of ${employee.roleTitle}`); 
            console.log("\n"); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async updateEmployeeManagerSql(employee, repeatfxn){
        try{
            await db.query({
                sql: `UPDATE employee
                     SET manager_id = ${employee.managerId}
                     WHERE id= ${employee.id}`, 
    
            }); 
            console.log("\n"); 
            console.log(`Updated ${employee.fullName} to have ${employee.managerName} as her/his new manager.`);
            console.log("\n");  
            repeatfxn(); 
        } catch (err) {
            if (err) console.log(err); 
        }
    }

    async addDepartmentData(department, repeatfxn){
        try {
            const {results} = await db.query({
                sql: `INSERT INTO department (name)
                 VALUES ("${department.name}")`,
            }); 
            console.log("\n"); 
            console.log(`Added ${department.name} to the database`); 
            console.log("\n");
            repeatfxn();  
        } catch(err) {
            console.log(err); 
        }
    }
}

module.exports = SqlQueries; 