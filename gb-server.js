let mysql = require("mysql");
let inquirer = require("inquirer");
let express = require("express");
//let table = require("table");


let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Wink1984",
    database: "greatbay_db"
})



connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id \n" + connection.threadId);
    //connection.end();
});



const authUser = () => {
    return inquirer
        .prompt([{
                type: "input",
                message: "Username :",
                name: "username",

            },
            {
                type: "password",
                message: "Enter Passcode :",
                name: "accesscode"
            }
        ])
        .then((data) => {
            console.log("Made it to the auth")
            checkUser(data);
        });
};


//authUser();



//MAKE OUR FUNCTIONS
function checkUser(data) {
    var query = connection.query(
        "SELECT id FROM user WHERE ? AND ?",
        [{
                user_name: data.username
            },
            {
                access_code: data.accesscode
            }
        ],
        function (err, res) {
            if (err) throw console.log("Failed auth");
            actionRoutes();
            //console.log("You are all set");
            // Call updateProduct AFTER the INSERT completes
            //updateSong();
            //connection.end();
        }
    );
}

const actionRoutes = () => {
    return inquirer
        .prompt([{
            type: "list",
            message: "What do you want to do",
            name: "action",
            choices: ["Create", "Bid", "Remove"]

        }])
        .then((data) => {
            switch (data.action) {
                case "Create":
                    console.log("Create");
                    createItem();
                    break;
                case "Bid":
                    console.log("Bid");
                    getFancyItems();
                    break;
                case "Remove":
                    console.log("Remove");
                    break;

            }
        });
};

const createItem = () => {
    return inquirer
        .prompt([{
            type: "input",
            message: "Enter item name",
            name: "item_name"
        }, {
            type: "list",
            message: "Mimimum Bid",
            name: "minbid",
            choices: [5, 10, 15, 20, 100],
            default: "10"
        }])
        .then((data) => {
            var query = connection.query(
                "INSERT INTO item SET ?", {
                    item_name: data.item_name,
                    price: data.minbid,

                },
                function (err, res) {
                    if (err) throw err;
                    newItem = res.insertId;
                    console.log(query.sql);
                    //console.log(JSON.stringify(res) + " Item added.!\n");
                    getItemInfo(newItem);


                });

            //connection.end();
        });
}

const getItemInfo = (id) => {
    var query = connection.query(
        "SELECT * FROM item WHERE ?", {
            id: id,
        },
        function (err, res) {
            if (err) throw err;
            console.log(query.sql);
            console.log(JSON.stringify(res) + " Item added.!\n");
            //getFancyItems();

        });
}

const getFancyItems = () => {
    var query = connection.query(
        "SELECT * FROM item ORDER BY id DESC",
        function (err, res) {
            if (err) throw err;
            renderAuction(res);

            bidOnItem();


            //console.log(res);
        });

}

function renderAuction(res) {

    console.log(`AUCTION ID   |   ITEM   |   PRICE   | # OF BIDS`);
    for (var i = 0; i < res.length; i++) {

        console.log(`${res[i].id}   |   ${res[i].item_name}   |   ${res[i].price}   | ${res[i].bid_count}`)
    }

};

const bidOnItem = () => {
        return inquirer
            .prompt([{
                    type: "input",
                    message: "Enter auction ID",
                    name: "auctionID"
                },
                {
                    type: "input",
                    message: "Enter a bid amount",
                    name: "bidAmount"
                }
            ])
            .then((data) => {

                    var query = connection.query(
                        "INSERT INTO user_bid SET ?", {
                            id_user: 1,
                            id_item: data.auctionID,
                            bid_amount: data.bidAmount
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log(query.sql);
                            console.log(JSON.stringify(res) + " Item added.!\n");
                            // getItemInfo(newItem)

                        });
                })};

actionRoutes();