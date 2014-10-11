
game = {types: ["phone","mail","facebook","twit"], values: {}};
var imageWidth = 64;
var bufferOffset = 15;

function Customer(level)
{
	this.randT = Math.floor(Math.random() * 4); //Any type from 0-3
    this.randM = Math.floor(Math.random() * 3); //Any mood from 0-2
	this.randVal = 100 * level; //Any cash value from 5-level
    if(this.randM === 1){
        this.randVal *= 5;
    }
}

function addCustomers()
{
    var averageEmployee = (game.employees[0].count + game.employees[1].count + game.employees[2].count + game.employees[3].count)/4 + 1; //Crappy average calculation
    var customer = new Customer(game.player.level,game.employees.length);
    customer.sprite  = game.scene.Sprite(customerImage(customer.randT, customer.randM), game.layer);
    customer.sprite.move(game.positions[customer.randT], -imageWidth);
    customer.sprite.size(imageWidth, imageWidth);
    customer.sprite.scale(1);
    var speedBonus = [1,1.5,1.5]
    customer.sprite.yv = 3 * game.player.level * speedBonus[customer.randM];
    customer.sprite.update();

    game.values[customer.sprite.id] = customer.randVal;

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
            delete game.values[customer.id];
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

                    game.satisfaction++;
                    game.player.addCash(game.values[customer.id]);
                    propagateSatisfaction();
                    propagateCash();
                    
                    game.customerSprites.remove(customer);
                    customer.remove();         
                    delete game.values[customer.id];
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

function propagateSatisfaction() {
    game.ngScope.$apply(function(){game.ngScope.satisfaction = game.satisfaction;});
}

function propagateCash() {
    game.ngScope.$apply(function(){game.ngScope.player.cash = game.player.cash;});
}
