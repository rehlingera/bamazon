var inquirer = require("inquirer");
var mysql = require("mysql");

var balance = 5000;

//Greeting function...
greeting = function() {
    //Display a bamazon logo...
    console.log(" ▄▀▀█▄▄   ▄▀▀█▄   ▄▀▀▄ ▄▀▄  ▄▀▀█▄   ▄▀▀▀▀▄   ▄▀▀▀▀▄   ▄▀▀▄ ▀▄\n▐ ▄▀   █ ▐ ▄▀ ▀▄ █  █ ▀  █ ▐ ▄▀ ▀▄ █     ▄▀ █      █ █  █ █ █\n  █▄▄▄▀    █▄▄▄█ ▐  █    █   █▄▄▄█ ▐ ▄▄▀▀   █      █ ▐  █  ▀█\n  █   █   ▄▀   █   █    █   ▄▀   █   █      ▀▄    ▄▀   █   █\n ▄▀▄▄▄▀  █   ▄▀  ▄▀   ▄▀   █   ▄▀     ▀▄▄▄▄▀  ▀▀▀▀   ▄▀   █\n█    ▐   ▐   ▐   █    █    ▐   ▐          ▐          █    ▐\n▐                ▐    ▐                              ▐\n");
    //Ask the person if they'd like to shop or exit...
    inquirer.prompt(
        {
            type:"list",
            message:"Welcome to Bamazon. Please select what you would like to do.",
            choices:["SHOP","EXIT"],
            name:"choice"
        }).then(function(answers) {
            //If they choose to shop, run the shop function...
            if(answers.choice==="SHOP") {
                shop();
            }
            //If they choose to exit, run the exit function...
            else if (answers.choice==="EXIT"){
                exit();
            };
        });
};

//Run the greeting function at the start of the app...
greeting();

//The shop function...
function shop() {
    //Establish a connection to the server...
    var connection = mysql.createConnection({
        host:"localhost",
        port:3306,
        user:"root",
        password:"YourRootPassword",
        database: "bamazon"
    });
//Pull the data from the products table and run the shopItems function with it...
connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        shopItems(response);
        connection.end();
    }
)};
//Function to subtract stock from items after they are bought...
function changeStock(connection,newStock,selectedItem) {
    connection.query("UPDATE products SET stock_quantity=? WHERE product_name=?",[newStock,selectedItem], function (err,res) {
        if (err) throw err;
        shop();
    });
};
//ShopItems function...
shopItems = function(response) {
    //Start out the choices variable, with an EXIT option...
    var choices = ["EXIT"];
    //Scan through the products table and add each product name to the choices array...
    response.forEach(function(data) {
        choices.push(data.product_name);
    });
    //Show the user how much money they have and display the choices...
    inquirer.prompt([
        {
            type:"list",
            message:"You currently have $" + balance + " in your account. Choose an item you would like to explore.",
            choices:choices,
            name:"item"
        }
    ]).then(function(answers) {
        //If the user chooses to exit, run the exit function...
        if(answers.item==="EXIT"){
            exit();
        }
        //If they choose a product, display the details of the product...
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
            //...and ask the user if they'd like to buy it...
            inquirer.prompt(
                {
                    type:"list",
                    message:"Would you like to buy this item?",
                    choices:["Yes","No, return to products"],
                    name:"decision"
                }
            ).then(function(ans) {
                //If they choose to buy the item, ask the user how many they would like to buy...
                if(ans.decision==="Yes"){
                    inquirer.prompt(
                        {
                            type:"input",
                            message:"How many would you like to buy?",
                            name:"amount",
                            validate:validateNum
                        }
                    ).then(function(ans){
                        //If the amount requested is less than the amount available, ask the user to confirm purchase...
                        if(ans.amount<=selectedStock){
                            inquirer.prompt(
                                {
                                    type:"list",
                                    message:"The amount you selected totals to $" + selectedPrice*ans.amount + ". Confirm purchase?",
                                    choices: ["Yes","No, return to products"],
                                    name:"confirm"
                                }
                            ).then(function(conf){
                                //If the user confirms the purchase, establish a connection and run the changeStock function and send a message that the purchase is complete. Tell the user their balance...
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
                                //If they choose not to confirm the purchase, take the user back to products...
                                else if (conf.confirm==="No, return to products"){
                                    shopItems(response);
                                };
                            });
                        }
                        //If the user requests an amount that is greater than the stock amount, tell them there are not enough and take them back to products...
                        else if(ans.amount>selectedStock){
                            console.log("Not enough in stock at this time! Sorry! Come again!")
                            shopItems(response);
                        };
                    });
                }
                //If the user does not want to buy any of this product, take them back to the products list...
                else if (ans.decision==="No, return to products"){
                    shopItems(response);
                };
            });
        };
    });
};

//The function to validate number responses...
function validateNum(num){
   var reg = /^\d+$/;
   return reg.test(num) || "Please enter a number!";
};

//The exit function...
function exit() {
    //Log a goobye to the console and let the app close out.
    console.log("Thank you! Please come again!");
}