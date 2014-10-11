
game = {types: ["phone","mail","facebook","twit"]};
var imageWidth = 64;
var bufferOffset = 15;

function Customer(level, employees)
{
	this.randT = Math.floor(Math.random() * 4); //Any type from 0-3
    this.randM = Math.floor(Math.random() * 3); //Any mood from 0-2
	this.randVal = Math.floor(Math.random() + 5) * level * employees; //Any cash value from 5-level
}

function addCustomers()
{
    var averageEmployee = (game.employees[0].count + game.employees[1].count + game.employees[2].count + game.employees[3].count)/4 + 1; //Crappy average calculation
    var customer = new Customer(game.player.level,1);
    customer.sprite  = game.scene.Sprite(customerImage(customer.randT, customer.randM), game.layer);
    customer.sprite.move(game.positions[customer.randT], -imageWidth);
    customer.sprite.size(imageWidth, imageWidth);
    customer.sprite.scale(1);
    var speedBonus = [1,1.5,1.5]
    customer.sprite.yv = 3 * game.player.level * speedBonus[customer.randM];
    customer.sprite.update();

    game.customerSprites.add(customer.sprite);
    //game.customers.push(customer);
}

function customerImage(cType, cMood)
{
    var customerMood = ["n","m","a"];
    return "img/"+game.types[cType]+"-"+customerMood[cMood]+".png";
}

function initBuckets(){
    game.bucketLayer = game.scene.Layer("buckets");
    game.buckets = [];    

    for(var i = 0; i < 4; i++){
        var bucket = new Bucket(game.employees[i]);    
        bucket.sprite  = game.scene.Sprite("img/bucket.png",game.layer);
        var type = game.employees[i].type;
        bucket.sprite.move(game.positions[type], 50 + (127*i));
        bucket.sprite.size(imageWidth, imageWidth);
        bucket.disappear();
        bucket.sprite.update();
        game.buckets.push(bucket);
    }
}

$(document).ready(function () 
{
    $container = $("#canvas-container")
    game.customers = [];
    game.size = {width: $container.innerWidth(), height: $container.innerWidth()};
    game.scene = sjs.Scene({w: game.size.width, h: game.size.height, parent: $container[0]});
    game.layer = game.scene.Layer("front");
    
    var gap = game.size.width/8;
    game.positions = [gap-(imageWidth/2) - bufferOffset, gap*3-(imageWidth/2) - bufferOffset, gap*5-(imageWidth/2) - bufferOffset, gap*7-(imageWidth/2) - bufferOffset];

    game.input = game.scene.Input();
    game.customerSprites = sjs.List();
    game.tickCounter = 0;
    game.ticker = game.scene.Ticker(draw);
    game.satisfaction = 50;
    propagateSatisfaction();

    initBuckets();

    game.ticker.run();
});

function paintKeys()
{


}

function loseGame()
{

}

function draw()
{
    if(game.input.keyPressed("a"))
        console.log("A");
    if(game.input.keyPressed("s"))
        console.log("S");
    if(game.input.keyPressed("d"))
        console.log("D");
    if(game.input.keyPressed("f"))
        console.log("F");

    var  customer;
    while(customer = game.customerSprites.iterate()) 
    {
        //console.log(game.customerSprites.list.length);
        customer.applyVelocity();
        customer.update();

        if(customer.y > (game.size.height))
        {
            game.customerSprites.remove(customer);
            customer.remove();
            game.satisfaction -= 1;
            propagateSatisfaction();

            if(game.satisfaction < 0.5)
                loseGame();
        }
    }

    game.tickCounter++;
    if (game.tickCounter % 50 == 0) {
        addCustomers();
    }

    for(var i in game.buckets){
        var bucket = game.buckets[i];
        
        if(bucket.visible){
            for(var j in game.customerSprites.list){
                var customer = game.customerSprites.list[j];
                if(bucket.sprite.y - customer.y <= 32 && bucket.sprite.y - customer.y > -64 && Math.abs(bucket.sprite.x - customer.x) < 1){
                    bucket.disappear();
                    bucket.sprite.update();
                    
                    game.customerSprites.remove(customer);
                    customer.remove();           
                }
            }
        }else{
            if(bucket.shouldAppear()){
                bucket.appear();
                bucket.sprite.update();
            }    
        }
    }
}

function propagateSatisfaction()
{
    game.ngScope.$apply(function(){game.ngScope.satisfaction = game.satisfaction;});
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