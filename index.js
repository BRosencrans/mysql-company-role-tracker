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
                  "View employees by different departments",
                  "View Company budgets",
                  "Add a new department", 
                  "Add a new job title", 
                  "Add a new employee", 
                  "Update an employee job title",
                  "Update an employee's manager",
                  "Delete a department from the database",
                  "Delete a job title from the database",
                  "Delete an employee from the database",           
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
        
        if (actions === "View employees by different departments") {
          showEmployeeDepartment();
        }
       
        if (actions === "View Company budgets") {
          viewCompanyBudget();
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
  
        if (actions === "Delete a department from the database") {
          deleteDepartmentFromDb();
        }
  
        if (actions === "Delete a job title from the database") {
          deleteJobTitleFromDb();
        }
  
        if (actions === "Delete an employee from the database") {
          deleteEmployeeFromDb();
        }
  
        if (actions === "Exit") {
          dbConnection.end()
      };
    });
  };
  
  //Function to shows all departments in the company
  showAllDepartments = () => {
    console.log("Now showing all departments in the company...\n");
    dbConnection.query(`SELECT department.id AS id, department_name AS department FROM department`, (err, data) => {
      if (err) throw err;
      console.table(data);
      companyMenu();
    });
  };
//Function to show all job titles in the company
  showAllJobTitles = () => {
    console.log("Now showing all job titles in the company...\n");
    dbConnection.query(`SELECT role.id, role.job_title AS title, department.department_name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`, (err, data) => {
      if (err) throw err; 
      console.table(data); 
      companyMenu();
    })
  };
//Function to show all employees of the company
showAllEmployees = () => {
    console.log("Now showing all employees of the company...\n"); 
    dbConnection.query(`SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.job_title AS title, 
    department.department_name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, data) => {
      if (err) throw err; 
      console.table(data);
      companyMenu();
    });
  };
//Function that shows lists all employees by their various departments
  showEmployeeDepartment = () => {
    console.log("Now showing employee's by departments...\n");
    dbConnection.query( `SELECT employee.first_name, 
    employee.last_name, 
    department.department_name AS department
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id`, (err, data) => {
      if (err) throw err; 
      console.table(data); 
      companyMenu();
    });          
  };
  //Function that shows the budget for each department
  viewCompanyBudget = () => {
    console.log('Now showing the company budget for each department...\n');
    dbConnection.query(`SELECT department_id AS id, 
    department.department_name AS department,
    SUM(salary) AS budget
    FROM  role  
    JOIN department ON role.department_id = department.id GROUP BY department_id`, (err, data) => {
      if (err) throw err; 
      console.table(data);
      companyMenu(); 
    });            
  };
// Function to add a new department
addNewDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'newDept',
      message: "what's the name of the new department you'd like to add?",
      
    }
  ])
    .then(answer => {
      dbConnection.query( `INSERT INTO department (department_name)
      VALUES (?)`, answer.newDept, (err, result) => {
        if (err) throw err;
        console.log(answer.newDept +" is now a new department."); 
        showAllDepartments();
    });
  });
};
// Function to add a new job title
addNewJobTitle = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'jobTitle',
      message: "What new job title would you like to add??"
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this job??"
    },
    {
      type: 'input',
      name: 'deptId',
      message: "Whats the department id number for this job title?"
    }
  ])
  .then(answers => {
    dbConnection.query(`INSERT INTO role(job_title, salary,   department_id)
     VALUES(?, ?, ?);`, [answers.jobTitle, answers.salary, answers.deptId], function (err, result) {
      if (err) {
       throw Error(err)
      }
      console.log(answers.jobTitle +" is now a new job title.")
      showAllJobTitles();
    });
 });
};
//Function To add a new employee to the Company
 addNewEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What's the new employees first name?"
    },
    {
      type: 'input',
      name: 'lastName',
      message:"What's the new employees last name?"
    },
    {
      type: 'input',
      name: 'jobTitleId',
      message: "What's the new employees job title id?"
    },
    {
      type: 'input',
      name: 'managerId',
      message: "Whats the employee Id of the new employees manager, type NULL if new employee is a manager"
    }
  ])
  .then(answers => {
    dbConnection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
     VALUES(?,?,?,?)`, [answers.firstName, answers.lastName, answers.jobTitleId, answers.managerId], function (err, results) {
      if (err) {
         throw Error(err)
        }
        console.log(answers.firstName + " is now an employee of Company!")
        showAllEmployees();
      });
  })
}