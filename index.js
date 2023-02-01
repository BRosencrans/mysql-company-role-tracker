//Required Modules
const mySql= require ('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table'); 

//connects to the mysql database
const dbConnection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "password",
    database: 'company_db'
  });

  dbConnection.connect(err => {
    if (err) throw err;
    connectionEstablished()
  });

  //Welcome Screen after connection has been established to database
   connectionEstablished= () => {
    console.log("###################################")
    console.log("#                                 #")
    console.log("#    Company Roles and Budget     #")
    console.log("#                                 #")
    console.log("###################################")
    companyMenu();
  };

  //inquirer prompt that brings up all possible actions
  const companyMenu = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: "Hello what can i do for you today?",
        choices: ["View all Company departments", 
                  "View all job titles", 
                  "View all employees", 
                  "Add a new department", 
                  "Add a new job title", 
                  "Add a new employee", 
                  "Update an employee job title",
                  "Update an employee's manager",
                  "View employees by different departments",
                  "Delete a department from the database",
                  "Delete a job title from the database",
                  "Delete an employee from the database",
                  "View Company budgets",
                  "Exit"
                ]
      }
    ])//all the choice routes
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all Company departments") {
          showDepartments();
        }
  
        if (choices === "View all job titles") {
          showJobTitles();
        }
  
        if (choices === "View all employees") {
          showEmployees();
        }
  
        if (choices === "Add a new department") {
          addNewDepartment();
        }
  
        if (choices === "Add a new job title") {
          addNewJobTitle();
        }
  
        if (choices === "Add a new employee") {
          addNewEmployee();
        }
  
        if (choices === "Update an employee job title") {
          updateEmployeeJobTitle();
        }
  
        if (choices === "Update an employee's manager") {
          updateEmpManager();
        }
  
        if (choices === "View employees by different departments") {
          showEmployeeDepartment();
        }
  
        if (choices === "Delete a department from the database") {
          deleteDepartmentFromDb();
        }
  
        if (choices === "Delete a job title from the database") {
          deleteJobTitleFromDb();
        }
  
        if (choices === "Delete an employee from the database") {
          deleteEmployeeFromDb();
        }
  
        if (choices === "View Company budgets") {
          viewCompanyBudget();
        }
  
        if (choices === "Exit") {
          dbConnection.end()
      };
    });
  };