
INSERT INTO department(department_name)
VALUES 
("Sales"),
("Finance"),
("Legal"),
("Engineering");

INSERT INTO role (job_title, salary, department_id)
VALUES
("Sales Lead", 88000, 1),
("Marketing Coordindator", 78000, 1),
("Finanical Analyst", 150000, 2),
("Accountant", 125000, 2), 
("Senior Legal Counsel", 2000000, 3),
("Junior Legal Counsel", 90000, 3),
("Lead Engineer", 120000, 4),
("Q/A Tester", 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Conrad", "Chambers", 1 , null),
("Brooke", "Fisher", 2, null),
("Ernest", "Poole", 3 , null),
("Deena", "Trippe", 4, null),
("Kayla","Summers", 5, null),
("Guy" ,"Marshall", 6, 5),
("Jessie", "Powers", 7, null),
("Nicole", "Jefferson", 8, 7);