
game = {};

function Customer(level, employees)
{
	this.randT = Math.floor(Math.random() * 3); //Any type from 0-3
	this.randR = Math.floor(Math.random() + 1 ) * level; //Any rage value from 1-level
	this.randVal = Math.floor(Math.random() + 5) * level * employees; //Any cash value from 5-level
}

function addCustomers(level, employees)
{
    console.log("Adding customer");
    var customer = new Customer(1,1);
    //var types = ["email","facebook","twitter","phone"];
    var customerSprite = game.scene.Sprite(customerImage(customer.randT), game.layer);
    customerSprite.move(Math.random() * game.size.width - 150, Math.random() * game.size.height - 150);
    customerSprite.size(300, 300);
    customerSprite.scale(0.25);
    customerSprite.yv = 50;
    customerSprite.update();

    game.customers.add(customerSprite);
}
function customerImage(customertype)
{
    var image;
    switch(customertype)
    {
        case 0: image = "img/employee1.png"; break;
        case 1: image = "img/employee2.png"; break;
        case 2: image = "img/employee3.png"; break;
        case 3: image = "img/employee4.png"; break;
    }
    return image
}

$(document).ready(function () 
{
    $container = $("#canvas-container")
    game.size = {width: $container.innerWidth(), height: $container.innerWidth()*3/4};
    game.scene = sjs.Scene({w: game.size.width, h: game.size.height, parent: $container[0]});
    game.layer = game.scene.Layer("front");
    game.input = game.scene.Input();
    game.customers = sjs.List();
    game.tickCounter = 0;
    game.ticker = game.scene.Ticker(draw);

    game.ticker.run();
   
    /*player = game.scene.Sprite("img/twitter.png");
    player.setX(200);
    player.setY(200);
    player.canvasUpdate(game.layer);
    player.applyYVelocity();*/
    /*
    var enemy = game.scene.Sprite('img/employee1.png', game.layer);
    enemy.move(game.size.width / 2 - 150, game.size.height / 2 - 150);
    enemy.size(300, 300);
    enemy.scale(0.25);
    enemy.update();
    */
});


function draw()
{
    /*
	if(game.input.keyboard.right)
        console.log("YoMomma");
    */

    if(game.input.keyPressed("a"))
        console.log("A");
    if(game.input.keyPressed("s"))
        console.log("S");
    if(game.input.keyPressed("d"))
        console.log("D");
    if(game.input.keyPressed("f"))
        console.log("F");

    var  customer;
    while(customer = game.customers.iterate()) {
        console.log(customer.yv);
        customer.applyVelocity();
        customer.update();
    }

    game.tickCounter++;
    if (game.tickCounter % 10000) 
        {
            addCustomers();
        };
}

/*
function paintCustomer(targetY, Customer)
{
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("keydown",doKeyDown,true);
    input.keyPressed("A");

}
*/


/*
var ctx = document.getElementById("canvas").getContext("2d"),
    x = 10,
    y = 0,
    targetY = 300,
    velX = 0,
    velY = 10,
    thrust = 5;


function draw(){   
    var 
        ty = targetY - y,

    velY = (ty/dist)*thrust;

    // stop the box if its too close so it doesn't just rotate and bounce

    ctx.fillStyle = "#fff";
    ctx.clearRect(0,0,400,400);
    ctx.beginPath();
    ctx.rect(x, y, 10, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.rect(targetX, targetY, 10, 10);
    ctx.closePath();
    ctx.fill();

    setTimeout(function(){draw()}, 30);   
}

draw();

*/