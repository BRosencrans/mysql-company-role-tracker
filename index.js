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
        name: 'actions', 
        message: "Hello what can i do for you today",
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
        const {actions} = answers; 
  
        if (actions === "View all Company departments") {
          showAllDepartments();
        }
  
        if (actions === "View all job titles") {
          showAllJobTitles();
        }
  
        if (actions === "View all employees") {
          showAllEmployees();
        }
  
        if (actions === "Add a new department") {
          addNewDepartment();
        }
  
        if (actions === "Add a new job title") {
          addNewJobTitle();
        }
  
        if (actions === "Add a new employee") {
          addNewEmployee();
        }
  
        if (actions === "Update an employee job title") {
          updateEmployeeJobTitle();
        }
  
        if (actions === "Update an employee's manager") {
          updateEmpManager();
        }
  
        if (actions === "View employees by different departments") {
          showEmployeeDepartment();
        }
  
        if (actions === "Delete a department from the database") {
          deleteDepartmentFromDb();
        }
  
        if (actions === "Delete a job title from the database") {
          deleteJobTitleFromDb();
        }
  
        if (actions === "Delete an employee from the database") {
          deleteEmployeeFromDb();
        }
  
        if (actions === "View Company budgets") {
          viewCompanyBudget();
        }
  
        if (actions === "Exit") {
          dbConnection.end()
      };
    });
  };