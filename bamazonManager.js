var inquirer = require("inquirer");
var mysql = require("mysql");

//Greeting function...
greeting = function() {
    //Display a bamazon logo...
    console.log(" ▄▀▀█▄▄   ▄▀▀█▄   ▄▀▀▄ ▄▀▄  ▄▀▀█▄   ▄▀▀▀▀▄   ▄▀▀▀▀▄   ▄▀▀▄ ▀▄\n▐ ▄▀   █ ▐ ▄▀ ▀▄ █  █ ▀  █ ▐ ▄▀ ▀▄ █     ▄▀ █      █ █  █ █ █\n  █▄▄▄▀    █▄▄▄█ ▐  █    █   █▄▄▄█ ▐ ▄▄▀▀   █      █ ▐  █  ▀█\n  █   █   ▄▀   █   █    █   ▄▀   █   █      ▀▄    ▄▀   █   █\n ▄▀▄▄▄▀  █   ▄▀  ▄▀   ▄▀   █   ▄▀     ▀▄▄▄▄▀  ▀▀▀▀   ▄▀   █\n█    ▐   ▐   ▐   █    █    ▐   ▐          ▐          █    ▐\n▐                ▐    ▐                              ▐\n┌┬┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐  ┌─┐┌┬┐┬┌┬┐┬┌─┐┌┐┌\n│││├─┤│││├─┤│ ┬├┤ ├┬┘  ├┤  │││ │ ││ ││││\n┴ ┴┴ ┴┘└┘┴ ┴└─┘└─┘┴└─  └─┘─┴┘┴ ┴ ┴└─┘┘└┘\n");
    console.log("Welcome to Bamazon for Managers.")
    //Start with a prompt...
    startPrompt();
};

//The starting prompt...
function startPrompt () {
    //Ask the person what they'd like to do...
    inquirer.prompt(
        {
            type:"list",
            message:"Please select what you would like to do.",
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","EXIT"],
            name:"choice"
        }).then(function(answers) {
            //Take the user to the proper option of their choice...
            if(answers.choice==="View Products for Sale"){
                viewProducts();
            }
            else if (answers.choice==="View Low Inventory"){
                viewLow();
            }
            else if (answers.choice==="Add to Inventory"){
                addInventory();
            }
            else if (answers.choice==="Add New Product"){
                addProduct();
            }
            else if (answers.choice==="EXIT"){
                exit();
            };
        });
};

//Run the greeting function at the start of the app...
greeting();

//Function to view products...
function viewProducts() {
    //Establish a connection to the server...
    var connection = mysql.createConnection({
        host:"localhost",
        port:3306,
        user:"root",
        password:"YourRootPassword",
        database: "bamazon"
    });
//Pull the data from the products table...
connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        //Establish an array and push each row into it...
        var itemsArray = [];
        response.forEach(function(data){
            var object = {
                ID:data.item_id,
                Product:data.product_name,
                Price:data.price,
                Stock:data.stock_quantity
            };
            itemsArray.push(object)
        });
        //Log the array of products to the console...
        console.log(itemsArray);
        connection.end();
        //Take the user back the the start prompt...
        startPrompt();
    }
)};

function viewLow() {
    //Establish a connection to the server...
    var connection = mysql.createConnection({
        host:"localhost",
        port:3306,
        user:"root",
        password:"YourRootPassword",
        database: "bamazon"
    });
    //Pull the data from the products table only for items with a stock quantity less than 5...
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",  function(err, response) {
        if (err) throw err;
        //Establish an array and push each row into it...
        var itemsArray = [];
        response.forEach(function(data){
            var object = {
                ID:data.item_id,
                Product:data.product_name,
                Price:data.price,
                Stock:data.stock_quantity
            };
            itemsArray.push(object)
        });
        //Log the array of products to the console...
        console.log(itemsArray);
        connection.end();
        //Take the user back the the start prompt...
        startPrompt();
    }
)};

function addInventory() {
    //Ask the user for information about the product they want to change...
    inquirer.prompt([
        {
            type:"input",
            message:"Type the ID number of the product you would like to edit.",
            name:"id",
            validate:validateNum
        },{
            type:"input",
            message:"How many would you like to add?",
            name:"amount",
            validate:validateNum
        }
    ]).then(function(answers){
        //Establish a connection to the server...
        var connection = mysql.createConnection({
            host:"localhost",
            port:3306,
            user:"root",
            password:"YourRootPassword",
            database: "bamazon"
        });
    //Update the stock quantity for the item indicated in the prompt...
    connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [answers.amount,answers.id], function(err, response) {
            if (err) throw err;
            //Let the user know they succeeded...
            console.log("Stock added!");
            connection.end();
            //Take the user back the the start prompt...
            startPrompt();
        });
    });
};

function addProduct() {
    //Ask the use for information about their new item...
    inquirer.prompt([
        {
            type:"input",
            message:"Enter the name of your item.",
            name:"name"
        },{
            type:"input",
            message:"Enter the price of your item.",
            name:"price",
            validate:validateNum
        },{
            type:"input",
            message:"Enter a description of your item.",
            name:"description"
        },{
            type:"input",
            message:"How many of the item are you adding?",
            name:"stock",
            validate:validateNum
        },{
            type:"input",
            message:"Enter the store's department where the item will go.",
            name:"department"
        }
    ]).then(function(answers) {
        //Establish a connection to the server...
        var connection = mysql.createConnection({
            host:"localhost",
            port:3306,
            user:"root",
            password:"YourRootPassword",
            database: "bamazon"
        });
        //Insert the new product into the products table using the information given in the prompt...
        connection.query("INSERT INTO products (product_name,department_name,price,description,stock_quantity) VALUES (?,?,?,?,?)",[answers.name,answers.department,answers.price,answers.description,answers.stock], function(err, response) {
            if (err) throw err;
            //Let the user know they succeeded...
            console.log("Product added!");
            connection.end();
            //Take the user back the the start prompt...
            startPrompt();
        });
    });
};

//The exit function...
function exit() {
    //Log a goodbye to the console and let the app close out.
    console.log("┌┬┐┬ ┬┌─┐┌┐┌┬┌─  ┬ ┬┌─┐┬ ┬┬\n │ ├─┤├─┤│││├┴┐  └┬┘│ ││ ││\n ┴ ┴ ┴┴ ┴┘└┘┴ ┴   ┴ └─┘└─┘o\n");
};

//The function to validate number responses...
function validateNum(num){
    var reg = /^\d+$/;
    return reg.test(num) || "Please enter a number!";
 };