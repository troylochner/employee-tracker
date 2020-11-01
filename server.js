let mysql = require("mysql");
let inquirer = require("inquirer");
const cTable = require("console.table");

//MAKING SOME HOLDER VALUES FOR ARRAYS
let deptArray = [];
let roleArray = [];
let employeeArray = [];
let managerArr = [];

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "test_user",
    password: "testPW",
    database: "employee_manager"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to the Employee Tracking Tool")
    startPage();
});

//MAKE THE HOME MENU
const homeMenu = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Test",
        "View All Employees",
        "Add Employee",
        "Update An Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "View All Employees By Role",
        "Show All Employees By Department",     
        "Exit",
      ],
    },
  ];

//Refactored my code - what I was doing wasn't working - was too complex.
function startPage() {
    inquirer.prompt(homeMenu).then((response) => {
      switch (response.action) {
        case "Add Employee":
        createEmployee();
          break;
        case "Add Role":
          createRole();
          break;
        case "Add Department":
          createDepartment();
          break;
        case "View All Employees":
          showEmployees();
          break;
        case "View All Employees By Role":
        showAllByRole();
          break;
        case "Show All Employees By Department":
            showAllByDepartment();
          break;
        case "View All Roles":
          showRoles();
          break;
        case "View All Departments":
          showDepartments();
          break;
        case "Update An Employee Role":
            updateEmployeeRole();
          break;
        case "Test":
          test();
          
          break;
        case "Exit":
          connection.end();
          break;
        default:
          connection.end();
      }
    });
    getDepartmentList();
    getRoleList();
    getEmployeeList();

  }

//EMPLOYEES
function getEmployeeList() {
    connection.query("SELECT last_name FROM employee", function (err,res) {
      if (err) throw err;
      employeeArray = [];
      for (i = 0; i < res.length; i++) {
        employeeArray.push(res[i].last_name);
      };
    });
  }


  const showEmployees=()=>{
    var query = connection.query(
        "SELECT * FROM employee",
        function(err,res){
            if(err) throw err ;
            console.table(res);
            startPage();
        });
};

const createEmployee=()=>{
    return inquirer
    .prompt([{
        type: "input",
        name: "first_name",
        message: "First Name:"
    }, {
        type:"input",
        name:"last_name",
        message:"Last Name"
    },{
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleArray,
      },{
        name: "manager",
        type: "list",
        message: "Who is this employee's Manager?",
        choices: employeeArray,
      }
    
 ]).then ((data)=> {
     //CONVERT STRINGS TO IDS BEFORE POSTING // NOT WORKING
     //NOT THE PRETTIEST WAY TO DO THIS -- BUT IT DOES WORK -- WOULD NOT WORK WELL AT LARGE SCALE I ASSUME
     var query = `
     INSERT INTO employee (first_name,last_name,role_id,manager_id) 
     VALUES (?,?,(SELECT id FROM role WHERE name = ?),(SELECT emp.id FROM employee emp WHERE emp.last_name = ?) )`
     connection.query(query, [data.first_name, data.last_name, data.role, data.manager], function (err, res) {
         if (err) throw err;
         showEmployees()
     });
 })};
 

//DEPARTMENTS
function getDepartmentList() {
connection.query("SELECT name FROM department", function (err,res) {
    if (err) throw err;
    deptArray = [];
    for (i = 0; i < res.length; i++) {
    deptArray.push(res[i].name);
    }
})}

const showDepartments=()=>{
var query = connection.query(
    "SELECT * FROM department",
    function(err,res){
        if(err) throw err ;
        console.table(res);
        startPage();
})}

function showAllByDepartment() {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee 
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.id = department.id 
        ORDER BY department.name`,
        function (err, data) {
            if (err) throw err;
            console.table(data);
            startPage();
        });
}

const createDepartment = () => {
    return inquirer
        .prompt([{
            type: "input",
            name: "name",
            message: "Department Name:"
        }])
        .then((data) => {
            var query = "INSERT INTO department (name) VALUES (?)";
            connection.query(query, data.name, function (err, res) {
                if (err) throw err;
                showDepartments()
            });
        });
};



 //ROLES 
  function getRoleList() {
      connection.query("SELECT name FROM role", function (err, res) {
          if (err) throw err;
          roleArray = [];
          for (i = 0; i < res.length; i++) {
              roleArray.push(res[i].name);
          };
      });
  }

  const showRoles = () => {
      var query = connection.query(
          "SELECT * FROM role",
          function (err, res) {
              if (err) throw err;
              console.table(res);
              startPage();
          });
  };
function showAllByRole() {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.name, role.salary, department.name FROM employee 
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id 
      ORDER BY role.name`,
        function (err, data) {
            if (err) throw err;
            console.table(data);
            startPage();
        }
    );
}

const createRole = () => {
    return inquirer
        .prompt([{
            type: "input",
            name: "name",
            message: "Role Title:"
        }, {
            type: "input",
            name: "salary",
            message: "Salary Amount:"
        },
        {
            name: "department",
            type: "list",
            message: "Department:",
            choices: deptArray,
          }])
        .then((data) => {
            var query = `INSERT INTO role (name,salary,department_id) 
            VALUES (?,?,(SELECT id FROM department WHERE name = ?))`;
            connection.query(query, [data.name, data.salary,data.department], function (err, res) {
                if (err) throw err;
                showRoles()
            });
        });
};

const updateEmployeeRole = () => {
    return inquirer
        .prompt([
        {
            name: "employee",
            type: "list",
            message: "Select Employee :",
            choices: employeeArray,
          },
          {
            name: "role",
            type: "list",
            message: "New Role:",
            choices: roleArray,
          }
        ])
        .then((data) => {
            var query = `
            UPDATE employee  
            SET role_id = ( 
                SELECT id FROM role WHERE name = ?
                )
            WHERE last_name = ?`;
            connection.query(query, [data.role, data.employee], function (err, res) {
                if (err) throw err;
                showRoles()
            });
        });
};

