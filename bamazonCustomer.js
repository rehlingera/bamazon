var inquirer = require("inquirer");
var mysql = require("mysql");

var balance = 5000;

//Greeting function...
greeting = function() {
    //Display a bamazon logo...
    console.log("███   ██   █▀▄▀█ ██   ▄▄▄▄▄▄   ████▄    ▄\n█  █  █ █  █ █ █ █ █ ▀   ▄▄▀   █   █     █\n█ ▀ ▄ █▄▄█ █ ▄ █ █▄▄█ ▄▀▀   ▄▀ █   █ ██   █\n█  ▄▀ █  █ █   █ █  █ ▀▀▀▀▀▀   ▀████ █ █  █\n███      █    █     █                █  █ █\n        █    ▀     █                 █   ██\n       ▀          ▀\n");
    //Ask the person if they'd like to shop or exit...
    inquirer.prompt(
        {
            type:"list",
            message:"Welcome to Bamazon. Please select what you would like to do.",
            choices:["SHOP","EXIT"],
            name:"choice"
        }).then(function(answers) {
            if(answers.choice==="SHOP") {
                shop();
            }
            else if (answers.choice==="EXIT"){
                exit();
            };
        });
};

greeting();

// post = function() {
//     inquirer.prompt([
//         {
//             type:"input",
//             message:"What is your item?",
//             name:"name"
//         },{
//             type:"input",
//             message:"What is your asking price?",
//             name:"price"
//         },{
//             type:"input",
//             message:"Describe your item.",
//             name:"description"
//         },{
//             type:"list",
//             message:"What is the condition of your item?",
//             choices:["New","Very Good","Good","Acceptable","Poor"],
//             name:"condition"
//         }
//     ]).then(function(answers) {
//         var name = answers.name;
//         var price = answers.price;
//         var description = answers.description;
//         var condition = answers.condition;

//         var connection = mysql.createConnection({
//             host:"localhost",
//             port:3306,
//             user:"root",
//             password:"YourRootPassword",
//             database: "greatBay_DB"
//         });
//         connection.connect(function(err) {
//             if (err) throw err;
//             console.log("Connected as id " + connection.threadId);
//             postItem(connection,name,price,description,condition);
//             connection.end();
//         });
//     })
// };

function shop() {
    var connection = mysql.createConnection({
        host:"localhost",
        port:3306,
        user:"root",
        password:"YourRootPassword",
        database: "bamazon"
    });
connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        shopItems(response);
        connection.end();
    }
)};

function changeStock(connection,newStock,selectedItem) {
    connection.query("UPDATE products SET stock_quantity=? WHERE product_name=?",[newStock,selectedItem], function (err,res) {
        if (err) throw err;
        shop();
    });
};

shopItems = function(response) {
    var choices = ["EXIT"];
    response.forEach(function(data) {
        choices.push(data.product_name);
    });
    inquirer.prompt([
        {
            type:"list",
            message:"You currently have $" + balance + " in your account. Choose an item you would like to explore.",
            choices:choices,
            name:"item"
        }
    ]).then(function(answers) {
        if(answers.item==="EXIT"){
            exit();
        }
        else{
            console.log("===============\nProduct: "+answers.item);
            response.forEach(function(data){
                if(answers.item===data.product_name){
                    console.log("Price: $"+data.price+"\n===============\n"+data.description+"\n===============\n"+data.stock_quantity+" in stock");
                    selectedPrice=data.price;
                    selectedStock=data.stock_quantity;
                    selectedItem = answers.item;
                };
            });
            inquirer.prompt(
                {
                    type:"list",
                    message:"Would you like to buy this item?",
                    choices:["Yes","No, return to products"],
                    name:"decision"
                }
            ).then(function(ans) {
                if(ans.decision==="Yes"){
                    inquirer.prompt(
                        {
                            type:"input",
                            message:"How many would you like to buy?",
                            name:"amount",
                            validate:validateNum
                        }
                    ).then(function(ans){
                        if(ans.amount<=selectedStock){
                            inquirer.prompt(
                                {
                                    type:"list",
                                    message:"The amount you selected totals to $" + selectedPrice*ans.amount + ". Confirm purchase?",
                                    choices: ["Yes","No, return to products"],
                                    name:"confirm"
                                }
                            ).then(function(conf){
                                if(conf.confirm==="Yes"){
                                    balance = balance-(selectedPrice*ans.amount);
                                    newStock=selectedStock-ans.amount;
                                    var connection = mysql.createConnection({
                                        host:"localhost",
                                        port:3306,
                                        user:"root",
                                        password:"YourRootPassword",
                                        database: "bamazon"
                                    });
                                    connection.connect(function(err) {
                                        if (err) throw err;
                                        changeStock(connection,newStock,selectedItem);
                                        connection.end();
                                    });
                                    console.log("Purchase complete. You now have $" + balance + " in your account.");
                                }
                                else if (conf.confirm==="No, return to products"){
                                    shopItems(response);
                                };
                            });
                        }
                        else if(ans.amount>selectedStock){
                            console.log("Not enough in stock at this time! Sorry! Come again!")
                            shopItems(response);
                        };
                    });
                }
                else if (ans.decision==="No, return to products"){
                    shopItems(response);
                };
            });
        };
    });
};

function validateNum(num){
   var reg = /^\d+$/;
   return reg.test(num) || "Please enter a number!";
};

function exit() {
    console.log("Thank you! Please come again!");
}