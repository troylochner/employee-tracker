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

const getTables = () =>{
    var query = connection.query(
        "SHOW TABLES",
        function(err,res){
            if (err) throw err;
            console.log(res);
        }
    );
}

const getEmployee=(id) =>{};
const getDepartment=(id)=>{};
const getRole=(id)=>{};

getTables();
