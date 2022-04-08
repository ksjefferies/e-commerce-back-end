
INSERT INTO department (name)
VALUES
('IT'),
('Finance'),
('Sales'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 95000, 1),
('Vice President IT', 175000, 1),
('Software Developer', 110000, 1),
('Chief Financial Office', 175000, 2),
('Controller', 105000, 2),
('Regional Sales Rep', 84000, 3),
('Sales Manager', 145000, 3),
('Human Resource Manager', 125000, 4),
('Benefits Associate', 65000, 4),
('Onboarding Associate', 55000, 4),
('Seasonal Intern', 25000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Manny', 'Batista', 1, null),
('John', 'Patota', 2, 1),
('James', 'Hamilton', 3, null),
('Austin', 'Vazquez', 4, 2),
('Yvonne', 'Geary', 5, null),
('Ryan', 'White', 6, null),
('Kent', 'Jefferies', 7, 3),
('Carrie', 'Winslow', 8, 4),
('Savannah', 'Bartlet', 9, null),
('Daniel', 'Hixson', 10, null),
('Jake', 'Sikora', 11, null);