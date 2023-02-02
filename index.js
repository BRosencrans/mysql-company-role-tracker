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
    dbConnection.query(`SELECT department.id AS "Id", department_name AS "Department" FROM department`, (err, data) => {
      if (err) throw err;
      console.table(data);
      companyMenu();
    });
  };
//Function to show all job titles in the company
  showAllJobTitles = () => {
    console.log("Now showing all job titles in the company...\n");
    dbConnection.query(`SELECT role.id AS "Id", role.job_title AS "Job Title", department.department_name AS "Department"
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
    dbConnection.query(`SELECT employee.id AS "Id", 
    employee.first_name AS "First Name", 
    employee.last_name AS "Last Name", 
    role.job_title AS "Job Title", 
    department.department_name AS "Department",
    role.salary AS "Salary", 
    CONCAT (manager.first_name, " ", manager.last_name) AS "Manager"
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
    dbConnection.query(`SELECT department_id AS "Id", 
    department.department_name AS "Department",
    SUM(salary) AS "Budget"
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
      VALUES (?)`, answer.newDept, (err, data) => {
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
     VALUES(?, ?, ?);`, [answers.jobTitle, answers.salary, answers.deptId],  (err, data) => {
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
      message: "Whats the employee Id of the new employee's manager"
    }
  ])
  .then(answers => {
    dbConnection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
     VALUES(?,?,?,?)`, [answers.firstName, answers.lastName, answers.jobTitleId, answers.managerId], (err, data) => {
      if (err) {
         throw Error(err)
        }
        console.log(answers.firstName + " is now an employee of Company!")
        showAllEmployees();
      });
  })
};
//grabs both the employee and job title tables
updateEmployeeJobTitle = () => {
  dbConnection.query(`SELECT employee.id AS "Employee Id", first_name AS "First Name", last_name AS "Last Name", job_title  AS "Job Title", department_id AS "Department Id", salary AS "Salary", manager_id AS "Manager's employee Id" FROM role JOIN employee ON role.id = employee.role_id;`, (err, data) => {
      if (err) { throw Error(err) };
      console.table(data);
      dbConnection.query(`SELECT job_title AS "Job Title", role.id AS "Job Id", department.id AS "Department Id", salary AS "Salary" FROM department JOIN role ON department.id = role.department_id;`, function (err, data) {
          if (err) {
             throw Error(err)
            };
          console.table(data);
          updateJobTitle();
      });
  });
}
//Function to update an employee's job title
updateJobTitle = () => {
  inquirer.prompt(
      [
          {
              type: 'input',
              name: 'empId',
              message: "Please enter the employee Id you'd like to update"
          },
          {
              type: 'input',
              name: 'newJob',
              message: "Please enter the new Job title Id you'd like to use"
          }

      ]
  ).then(answers => {
    dbConnection.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [answers.newJob, answers.empId], (err, data) => {
          if (err) {
              throw Error(err)
          };
          console.log("Job Title changed successfully");
          showAllEmployees();
      })
  })
};
//grabs table show all employee's and their manager if they have one
updateEmpManager = () => { 
  dbConnection.query(`SELECT employee.id AS "Employee Id", first_name AS "First Name", last_name AS "Last Name", job_title  AS "Job Title", department_id AS "Department  Id", salary AS "Salary", manager_id AS "Manager's employee Id" FROM role JOIN employee ON role.id = employee.role_id;`,  (err, data) => {
    if (err) {
      throw Error(err)
    };
    console.table(data);
     managerUpdate();
  })
};
//Function to update an employee's manager 
managerUpdate = () => {inquirer.prompt(
  [
      {
          type: 'input',
          name: 'empId',
          message: "Please enter the employee Id you'd like to update"
      },
      {
          type: 'input',
          name: 'newManager',
          message: "Please enter the new manager's employee Id"
      }

  ]
).then(answers => {
dbConnection.query(`UPDATE employee SET manager_id = ? WHERE id = ?;`, [answers.newManager, answers.empId], (err, data) => {
    if (err) {
          throw Error(err)
      };
      console.log("Employee's manager changed successfully");
      showAllEmployees();
  })
})
};
//Grabs all departments
deleteDepartmentFromDb = () => {
  dbConnection.query ( `SELECT id, department_name AS "Department" FROM department`, (err, data) => {
    if (err) {
      throw Error(err)
    }; 
    console.table(data); 
    deleteDepartment();
  })
};
//Function to delete a department from the database
deleteDepartment= () => {
  inquirer.prompt([
    {
      type: 'Input', 
      name: 'deptId',
      message: "which department id do you want to delete?",
    }
  ])
  .then(answer =>{dbConnection.query(`DELETE FROM department WHERE id = ?`,[answer.deptId], (err, data) => {
  if (err) {
    throw Error(err)
  };
  console.log("Department deleted successfully");
  showAllDepartments();
}
 )})
};

//Grabs all job titles
deleteJobTitleFromDb = () => {
  dbConnection.query ( `SELECT id, job_title AS "Job Title" FROM role`, (err, data) => {
    if (err) {
      throw Error(err)
    }; 
    console.table(data); 
    deleteJobTitle();
  })
};
//Function to delete a job title from the database
deleteJobTitle= () => {
  inquirer.prompt([
    {
      type: 'Input', 
      name: 'jobId',
      message: "which Job title id would you like to delete?",
    }
  ])
  .then(answer =>{dbConnection.query(`DELETE FROM role WHERE id = ?`,[answer.jobId], (err, data) => {
  if (err) {
    throw Error(err)
  };
  console.log("Job Title deleted successfully");
  showAllJobTitles();
}
 )})
};
//Grabs all employees
deleteEmployeeFromDb = () => {
  dbConnection.query ( `SELECT id AS "Employee Id", first_name AS "First Name", last_name AS "Last Name" FROM employee`, (err, data) => {
    if (err) {
      throw Error(err)
    };  
    console.table(data); 
    deleteEmployee();
  })
};
//Function to delete an employee from the database
deleteEmployee= () => {
  inquirer.prompt([
    {
      type: 'Input', 
      name: 'EmployeeId',
      message: "Please enter an employee Id for deletion",
    }
  ])
  .then(answer =>{dbConnection.query(`DELETE FROM employee WHERE id = ?`,[answer.EmployeeId], (err, data) => {
  if (err) {
    throw Error(err)
  };
  console.log("Employee deleted successfully");
  showAllEmployees();
}
 )})
};