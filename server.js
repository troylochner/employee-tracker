let mysql = require("mysql");
let inquirer = require("inquirer");
const cTable = require("console.table");

//MAKING SOME HOLDER VALUES FOR ARRAYS
let deptArray = [];
let roleArray = [];
let employeeArray = [];
//let managerArr = [];



let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Wink1984",
    database: "employee_manager"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to the Employee Tracking Tool")
    startPage();
});


console.log("Welcome to the employee tracker database !\n\n")

const homeMenu = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
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
          showAllByRoll();
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
          updateEmployee();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          connection.end();
      }
    });
    // update arrays each time the init function is called
    getDepartmentList();
    //console.log(deptArray)
    getRoleList();
    //console.log(roleArray)
    getEmployeeList();
    //console.log(employeeArray)
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
        "SELECT * FROM employee limit 25",
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
      },
    


 ])
 .then ((data)=> {
     //CONVERT STRINGS TO IDS BEFORE POSTING

     var query = "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
       connection.query(query, [data.first_name, data.last_name, data.role,data.manager] , function(err, res) {
        if (err) throw err;
        showEmployees()});
 });
};

//DEPARTMENTS
  function getDepartmentList() {
    connection.query("SELECT name FROM department", function (err,res) {
      if (err) throw err;
      deptArray = [];
      for (i = 0; i < res.length; i++) {
        deptArray.push(res[i].name);
      }
    });
  }

  const showDepartments=()=>{
    var query = connection.query(
        "SELECT * FROM department",
        function(err,res){
            if(err) throw err ;
            console.table(res);
            startPage();
        });
};

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
      }
    );
  } 

const createDepartment=()=>{
    return inquirer
       .prompt([{
           type: "input",
           name: "name",
           message: "Department Name:"
       }
    ])
    .then ((data)=> {
        var query = "INSERT INTO department (name) VALUES (?)";
       connection.query(query, data.name , function(err, res) {
        if (err) throw err;
        showDepartments()});
    });
   };



 //ROLES 
  function getRoleList() {
    connection.query("SELECT name FROM role", function (err,res) {
      if (err) throw err;
      roleArray = [];
      for (i = 0; i < res.length; i++) {
        roleArray.push(res[i].name);
      };
    });
  }

  const showRoles=() => {
    var query = connection.query(
        "SELECT * FROM role",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startPage();
        });
};

function showAllByRoll() {
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

const createRole=()=>{
    return inquirer
       .prompt([{
           type: "input",
           name: "first_name",
           message: "Role Title:"
       }, {
           type:"input",
           name:"last_name",
           message:"Salary Amount:"
       }
    ])
    .then ((data)=> {
        var query = "INSERT INTO employee (name,salary) VALUES (?,?)";
       connection.query(query, [data.name, data.salary] , function(err, res) {
        if (err) throw err;
        showRoles()});
    });
   };

//UNUSED AT CURRENT MOMENT
const selectEmployee=(id) =>{};
const getDepartment=(id)=>{};
const getRole=(id)=>{};

function updateEmployee() {
    connection.query(
      `SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee`,
      function (err, employees) {
        if (err) throw err;
        employeeArray = [];
        for (i = 0; i < employees.length; i++) {
            employeeArray.push(employees[i].Name);
        }
        connection.query("SELECT * FROM role", function (err, res2) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "employeeChoice",
                type: "list",
                message: "Which employee would you like to update?",
                choices: employeeArray ,
              },
              {
                name: "roleChoice",
                type: "list",
                message: "What is the employee's new role?",
                choices: roleArray,
              },
            ])
            .then(function (answer) {
              let roleID;
              for (let r = 0; r < res2.length; r++) {
                if (res2[r].title == answer.roleChoice) {
                  roleID = res2[r].role_id;
                }
              }
              // when finished prompting, update the db with that info
              connection.query(
                `UPDATE employee SET role_id = ? WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?)AS NAME)`,
                [roleID, answer.employeeChoice],
                function (err) {
                  if (err) throw err;
                }
              );
              startPage();
            });
        });
      }
    );
  }