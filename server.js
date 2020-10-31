let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Wink1984",
    database: "employee_manager"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id \n" +
    connection.threadId);
    //connection.end();
});

let x = []; 

console.log("Welcome to the employee tracker database !\n\n")

const startPage = () =>{
    return inquirer
    .prompt([{
        type:"list",
        name:"action",
        message:"Select a Database Section:",
        choices:["Employees","Roles","Departments","Quit"],    
    }])
    .then ((data)=> {
        switch (data.action) {
            case "Employees":
            console.log("startPage -> case:", data.action);
            employeeActionsMenu();
            break;
            case "Roles":
            console.log("startPage -> case:", data.action);
            roleActionsMenu();
            break;
            case "Departments":
            console.log("startPage -> case:", data.action);
            departmentActionsMenu();
            break;
            case "Quit":
            console.log("startPage -> case:", data.action); 
            console.log(x)
            connection.end();
        }
    });
};

const employeeActionsMenu = () =>{
    return inquirer
    .prompt([{
        type:"list",
        name:"action",
        message:"What would you like to do?",
        choices:["Show All","Find","Add New","Go Back"], 
    }])
    .then((data)=> {
        switch (data.action) {
            case "Show All":
            console.log("startPage -> case:", data.action);
            showEmployees();
            break;
            case "Find":
            console.log("startPage -> case:", data.action);
            //showRoles();
            break;
            case "Add New":
            console.log("startPage -> case:", data.action);
            createEmployee();
            break;
            case "Go Back":
            console.log("startPage -> case:", data.action);
            startPage();
            break;
        }
    });
};

const departmentActionsMenu = () =>{
    return inquirer
    .prompt([{
        type:"list",
        name:"action",
        message:"What would you like to do?",
        choices:["Show All","Find","Add New","Go Back"], 
    }])
    .then((data)=> {
        switch (data.action) {
            case "Show All":
            console.log("startPage -> case:", data.action);
            showDepartments();
            break;
            case "Find":
            console.log("startPage -> case:", data.action);
            //showRoles();
            break;
            case "Add New":
            console.log("startPage -> case:", data.action);
            createDepartment();
            break;
            case "Go Back":
            console.log("startPage -> case:", data.action);
            startPage();
            break;
        }
    });
};
const roleActionsMenu = () =>{
    return inquirer
    .prompt([{
        type:"list",
        name:"action",
        message:"What would you like to do?",
        choices:["Show All","Find","Add New","Go Back"], 
    }])
    .then((data)=> {
        switch (data.action) {
            case "Show All":
            console.log("startPage -> case:", data.action);
            showRoles();
            break;
            case "Find":
            console.log("startPage -> case:", data.action);
            //showRoles();
            break;
            case "Add New":
            console.log("startPage -> case:", data.action);
            createRole();
            break;
            case "Go Back":
            console.log("startPage -> case:", data.action);
            startPage();
            break;
        }
    });
};

const showEmployees=()=>{
    var query = connection.query(
        "SELECT * FROM employee limit 10",
        function(err,res){
            if(err) throw err ;
            x = (res)
            for (i = 0 ; i < res.length ; i++){
                console.log(`${res[i].id} - ${res[i].last_name}, ${res[i].first_name}`)
            }
            employeeActionsMenu();
        });
};

const showDepartments=()=>{
    var query = connection.query(
        "SELECT * FROM department",
        function(err,res){
            if(err) throw err ;
            console.log(res);
            startPage();
        });
};

const showRoles = () => {
    var query = connection.query(
        "SELECT * FROM role",
        function (err, res) {
            if (err) throw err;
            console.log(res);
            startPage();
        });
};

const getEmployee=(id) =>{};
const getDepartment=(id)=>{};
const getRole=(id)=>{};

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
    }
 ])
 .then ((data)=> {
     
    var query = connection.query(
        "INSERT * FROM department",
        function(err,res){
            if(err) throw err ;
            console.log(res);
            startPage();
        });



 });
};

const createRole=()=>{
    return inquirer
       .prompt([{
           type: "input",
           name: "name",
           message: "Role Title:"
       }, {
           type:"input",
           name:"salary",
           message:"Salary Amount:"
       }
    ])
    .then ((data)=> {
        var query = "INSERT INTO role (name,salary) VALUES (?,?)";
       connection.query(query, [data.name, data.salary] , function(err, res) {
        if (err) throw err;
        showRoles()});
    });
   };

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

startPage();