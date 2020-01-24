const mysql = require("mysql");
const {MySQL} = require("mysql-promisify"); 
const joinTables = `SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary,CONCAT(EM.first_name, " ", EM.last_name) as manager
FROM employee as E 
LEFT JOIN role as R on E.role_id = R.id 
LEFT JOIN department as D on D.id = R.department_id
LEFT JOIN employee as EM on EM.id = E.manager_id`; 

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

     async getCurrentEmployeeNamesIds(){
        try{
            const {results} = await db.query({
                sql: "SELECT first_name, last_name, id FROM employee",
            });  
            let employeeObjectArr= []; 
            for (const row of results){
                let employeeObject = {name: `${row.first_name} ${row.last_name}`,
                                        id: row.id}; 
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

    async insertEmployeeData(roleObjectsArr, employeeObjectArr, data, repeatfxn){
        let roleObject= roleObjectsArr.find(role => role.title === data.role); 
        let role_id= roleObject.id; 
        const managerObject = employeeObjectArr.find(employee => employee.name === data.manager); 
        let manager_id = managerObject.id; 
        try {
            const {results} = await db.query({
                sql: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES ("${data.firstName}", "${data.lastName}", ${role_id}, ${manager_id})`,
            }); 
            console.log(`Added ${data.firstName} ${data.lastName} to the database`); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async removeEmployeeData(firstName, lastName, repeatfxn){
        try {
            await db.query({
                sql: `DELETE FROM employee WHERE first_name= "${firstName}" AND last_name= "${lastName}"`,
            }); 
            console.log(`Removed ${firstName} ${lastName} from the database`); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async updateEmployeeRoleSql(employeeObjectArr, roleObjectsArr, updateEmployeeData, repeatfxn){
        let roleObject= roleObjectsArr.find(role => role.title === updateEmployeeData.newRole); 
        let role_id= roleObject.id; 
        let employeeObject = employeeObjectArr.find(employee => employee.name === updateEmployeeData.employeeToUpdate); 
        let employeeId= employeeObject.id;  
        try {
            await db.query({
                sql: `UPDATE employee 
                SET role_id = ${role_id}
                WHERE id = ${employeeId}`,
            }); 
            console.log( `Updated ${employeeObject.name} to the new role of ${roleObject.title}`); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async updateEmployeeManagerSql(employeeObjectArr, managerObjectArr, updateEmployeeData, repeatfxn){
        let updatedEmployeeObject = employeeObjectArr.find(employee => employee.name === updateEmployeeData.employeeToUpdate); 
        let updatedEmployeeId= updatedEmployeeObject.id;
        let newManagerObject =  managerObjectArr.find(employee => employee.name === updateEmployeeData.newManager); 
        let newMangerId= newManagerObject.id; 
        try{
            await db.query({
                sql: `UPDATE employee
                     SET manager_id = ${newMangerId}
                     WHERE id= ${updatedEmployeeId}`, 
    
            }); 
            console.log(`Updated ${updatedEmployeeObject.name} to have ${newManagerObject.name} as her/his new manager.`); 
            repeatfxn(); 
        } catch (err) {
            if (err) throw err; 
        }
    }
}

module.exports = SqlQueries; 