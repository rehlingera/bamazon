CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
   item_id INT(10) AUTO_INCREMENT PRIMARY KEY,
   product_name VARCHAR (50) NOT NULL,
   department_name VARCHAR (50) NOT NULL,
   price INT(10) NOT NULL,
   description VARCHAR(255),
   stock_quantity INT(10) NOT NULL
   );
   
INSERT INTO products (product_name,department_name,price,description,stock_quantity)
VALUES ("Blue Shell","Magical Curios",575,"This blue turtle shell will find the front runner in a race and knock them out. Great way to piss off that one friend who always beats you in everything.",43),
		("Snow Shovel","Hardware",15,"Tell that snow to go! This shovel made of quality materials will clear your sidewalk in no time. Absolutely does NOT use the cursed flame of Baphomet to melt the snow. Probably, absolutely.",104),
        ("Sorry! Monopoly Edition","Toys and Games",26,"We don't know how to play this. It's...it's some kind of crazy slap in the face of board game standards. Looks fun, though!",97),
        ("Giant LEGO Brick","Toys and Games",50,"This is a giant LEGO brick made out of regular LEGO bricks. It interlocks with other giant LEGO bricks made of regular LEGO bricks to make even bigger LEGO bricks.",72),
        ("Pencil","Office Supplies",1,"This is a standard yellow pencil. Perfectly normal. Do not be alarmed by its extra-commonplace long, yellow, hexagonal prism design. You are perfectly safe. There is a number 2 on it.",5000),
        ("This Rock","Magical Curios",764,"This rock talks. If you don't believe me, buy it and ask it yourself.",1),
        ("Bulk Screw Assortment, 5 lbs","Hardware",34,"This bag of screws contains screws of all shapes and sizes. The experimental physics department dumped them on us. 3-inch hex screws. 1-inch drywall screws. Impossible orthoplex screws from the 5th dimension. Nails.",400),
        ("Repurposed Stapler","Office Supplies",120,"This used to be a surgical stapler. If it can staple skin, it can probably staple, like, at least 50 pages.",86),
        ("Previously Owned X-Ray Goggles","Gadgets and Tech Accessories",700,"These goggles allow you to see through everything. Literally everything. When you put them on, you will float in an infinite sea of darkness, with no object in sight. These were returned by the previous owner, who went out of his mind.",1),
        ("Palm Pilot","Gadgets and Tech Accessories",2000,"Why walk when you can fly? Our miniature palm-sized robotic pilots are ATPL-certified and can fly any plane. When not in use, they are perfectly content to curl up and nap in your pocket. VERY CUTE!",22);

SELECT * FROM products;