
// const {MySQL} = require("mysql-promisify"); 
// const cTable = require("console.table");
// const SqlQueries = require("../lib/sql_queries"); 

// jest.mock("console.table");  
// jest.genMockFromModule("mysql-promisify"); 
// jest.mock("{MySQL}"); 
 

// describe("sql_queries", ()=>{
//     describe("getEmployeeNamesIds", ()=>{
//         it("Should return an array of objects after querying sql", ()=> {
//             const sqlQueries = new SqlQueries();
//             const db = new MySQL();  
//             const results =[
//                 { first_name: 'John', last_name: 'Doe', id: 1 },
//                 { first_name: 'Ashley', last_name: 'Rodriguez', id: 3 }

//             ]; 
//              const mockPromise = ()=>{ new Promise (function(resolve) {
//                 resolve({results})
//             })}; 
            
//             const mockdb = {
//                 query: mockPromise
//             }; 
//             MySQL.mockImplementation(()=>mockdb);
         

//             expect(sqlQueries.getCurrentEmployeeNamesIds()).toHaveReturnedWith([{name: "John Doe", id: 1}, {name: "Ashley Rodriguez", id: 3}]); 
//         }); 
//     }); 
// }); 