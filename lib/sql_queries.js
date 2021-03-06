const {MySQL} = require("mysql-promisify"); 
const cTable = require("console.table");
const joinTables = `SELECT E.id, E.first_name, E.last_name, R.title, D.name as department, R.salary,CONCAT(EM.first_name, " ", EM.last_name) as manager
FROM employee as E 
LEFT JOIN role as R on E.role_id = R.id 
LEFT JOIN department as D on D.id = R.department_id
LEFT JOIN employee as EM on EM.id = E.manager_id`; 

const db= new MySQL({
    //-----------------------INSERT YOUR CONNECTION INFORMATION HERE!!!----------------------------------------------------
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
            if (repeatfxn){
                repeatfxn(); 
            } else {
                return results
            }
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

    async getDepartmentData(){
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

    async getRoleData(){
        try {
            const {results} = await db.query({
                sql: "SELECT * FROM role",
            }); 
            let roleObjectArr=[]; 
            for (const row of results){
                roleObjectArr.push({title: row.title,
                                     id: row.id,
                                    departmentId: row.department_id,
                                    salary: row.salary}); 
            }
            return roleObjectArr; 
        } catch(err) {
            console.log(err); 
        }
    }

    async insertEmployeeData(employee, repeatfxn){
        try {
            const {results} = await db.query({
                sql: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES ("${employee.firstName}", "${employee.lastName}", ${employee.roleId}, ${employee.managerId})`,
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

    async viewAllDepartments(repeatfxn) {
        try {
            const {results} = await db.query({
                sql: "SELECT * FROM department ORDER BY id",
            }); 
            console.log("\n"); 
            console.table(results); 
            console.log("\n"); 
            repeatfxn(); 
        } catch (err){
            console.log(err); 
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

    async removeDepartmentData(department, repeatfxn){
        try {
            await db.query({
                sql: `DELETE FROM department WHERE id = ${department.id}`,
            }); 
            console.log("\n"); 
            console.log(`Removed ${department.name} from the database`); 
            console.log("\n"); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async viewAllRoles(repeatfxn) {
        try {
            const {results} = await db.query({
                sql: `SELECT R.id, R.title, R.salary, D.name as department 
                FROM role as R
                LEFT JOIN department as D on D.id = R.department_id
                ORDER BY R.id`,
            }); 
            console.log("\n"); 
            console.table(results); 
            console.log("\n"); 
            repeatfxn(); 
        } catch (err){
            console.log(err); 
        }  
     }

     async getRolesByDepartment(department, repeatfxn){
        try {
            const {results} = await db.query({
                sql: `SELECT R.id, R.title, R.salary, D.name as department 
                FROM role as R
                LEFT JOIN department as D on D.id = R.department_id
                 WHERE department_id = "${department.id}"
                 ORDER BY id`,
            }); 
            console.log("\n"); 
            console.table(results); 
            console.log("\n"); 
            repeatfxn(); 
        } catch (err){
            console.log(err); 
        }  
    }

    async addRoleData(role, repeatfxn){
        try {
            const {results} = await db.query({
                sql: `INSERT INTO role (title, salary, department_id)
                 VALUES ("${role.name}", ${role.salary}, ${role.departmentId})`,
            }); 
            console.log("\n"); 
            console.log(`Added ${role.name} to the database`); 
            console.log("\n");
            repeatfxn();  
        } catch(err) {
            console.log(err); 
        }
    }

    async removeRoleData(role, repeatfxn){
        try {
            await db.query({
                sql: `DELETE FROM role WHERE id = ${role.id}`,
            }); 
            console.log(`DELETE FROM role WHERE id = ${role.id}`); 
            console.log("\n"); 
            console.log(`Removed ${role.name} from the database`); 
            console.log("\n"); 
            repeatfxn(); 
        } catch(err) {
            console.log(err); 
        }
    }

    async updateRoleDepartmentSql(role, repeatfxn){
        try{
            await db.query({
                sql: `UPDATE role
                     SET department_id = ${role.departmentId}
                     WHERE id= ${role.id}`, 
    
            }); 
            console.log("\n"); 
            console.log(`Updated ${role.name} to be part of the ${role.departmentName} department.`);
            console.log("\n");  
            repeatfxn(); 
        } catch (err) {
            if (err) console.log(err); 
        }
    }
}

module.exports = SqlQueries; 