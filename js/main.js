game = {types: ["phone","mail","facebook","twit"], values: {}, wave: [], customerNumbers: [0,0,0,0],running: false};

var imageWidth = 64;
var bufferOffset = 15;

//Customer stats
function Customer()
{
    //Generates customer type (e.g phone, e-mail)
	this.randT = Math.floor(Math.random() * 4);

    //Generates customer mood.
    randif = Math.floor(Math.random() * 20);

    if (randif < 14) 
    {
        this.randM = 0;
    } 
    else if (randif < 17) 
    {
        this.randM = 1;
    } else 
    {
        this.randM = 2;
    }

    //Generates customer cash value.
	this.cash = 100 * game.player.level;
    if(this.randM === 1)
    {
        this.cash *= 5;
    }

    //Modifies cash based on customer type.
    switch(this.randT)
    {
        case 0: this.cash *= 1.5;
        case 1: this.cash *= 1.2;
        case 3: this.cash *= 0.8;
    }
    /*
    if(this.randT == 0) {
        this.cash *= 1.5;
    } else if(this.randT == 1) {
        this.cash *= 1.2;
    } else if(this.randT == 3) {
        this.cash *= 0.8;
    }
    */
}

//Generates customers
function addCustomer()
{
    //var averageEmployee = (game.employees[0].count + game.employees[1].count + game.employees[2].count + game.employees[3].count)/4 + 1; //Crappy average calculation
    
    var customer = new Customer(); //game.player.level,game.employees.length
    var speedBonus = [1,1.4,1.7]

    //Customer painting & level modfication
    customer.sprite  = game.scene.Sprite(customerImage(customer.randT, customer.randM), game.layer);
    customer.sprite.move(game.positions[customer.randT], -imageWidth);
    customer.sprite.size(imageWidth, imageWidth);
    customer.sprite.yv = 3 * game.player.level * speedBonus[customer.randM];
    customer.sprite.update();

    var reputation = customer.randM == 2 ? 3 : 1;
    game.values[customer.sprite.id] = {cash: customer.cash, rep: reputation};

    game.wave.push(customer);
    game.customerNumbers[customer.randT]++;
}

function showCustomer() 
{
    var customer = game.wave.pop();
    game.customerNumbers[customer.randT]--;
    game.customerSprites.add(customer.sprite);
    propagateCustomerNumbers();
    
    if(game.wave.length == 0)
        initWave();
}

//Chooses customer image type.
function customerImage(cType, cMood)
{
    var customerMood = ["n","m","a"];
    return "img/"+game.types[cType]+"-"+customerMood[cMood]+".png";
}

function initWave() 
{
    initVariables()
    //game.nextWaveAt = new Date();
    game.nextWaveAt.setTime(game.nextWaveAt.getTime() + game.waveBreak);

    //var waveNumbers = [15, 30, 75, 150, 300, 750, 1500, 3000];
    game.player.levelUp();
    for(var i = 0; i < game.waveNumbers[game.player.level-1]; i++)
    {
        addCustomer();   
    }
    setTimeout(function(){propagateCustomerNumbers();},10);
}

function initBuckets(){
    game.buckets = [];    

    for(var i = 0; i < 4; i++){
        var bucket = new Bucket(game.employees[i]);
        var type = game.employees[i].type;

        bucket.sprite  = game.scene.Sprite("img/service.png",game.layer);
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
    game.buttons = sjs.List();
    var time = (new Date().getTime());
    game.buttonStates = [1,1,1,1] //OFF
    propagateSatisfaction();

    initBuckets();
    initButton();

});

function initButton()
{  
    game.buttonLayer = game.scene.Layer("buttons");
    buttonLabels = ["A","S","D","F"];

    for(var s in buttonLabels)
    {
        button  = game.scene.Sprite("img/btn-"+buttonLabels[s]+".png", game.buttonLayer);
        button.move(game.positions[s], 500);
        button.size(imageWidth, imageWidth);
        button.update();
        game.buttons.add(button);
    }

}

function loseGame()
{   
    game.running=false;
    document.getElementById('nooo').play();
    $("#dialogue-box2").fadeIn();
    for (var i = game.customerSprites.list.length - 1; i >= 0; i--) {
        game.customerSprites.list[i].remove();
    };
    for (var j = 0; j < game.buckets.length; j++) {
        game.buckets[j].sprite.remove();
    };
    game.ticker.stop();

}

function buttonCheck(character, index)
{
    if(game.input.keyPressed(character) && game.buttonStates[index] == 1)
    {
        game.buttons.list[index].setYOffset(imageWidth);
        game.buttons.list[index].update();
        checkPresence(index);

        game.buttonStates[index] = 0;

        setTimeout(function()
        {
            game.buttonStates[index] = 1;
            game.buttons.list[index].setYOffset(0);
            game.buttons.list[index].update();
        },200)
    }
}

function addSatisfaction(){
    if (game.satisfaction+1 <= 100) {
        game.satisfaction++;
    }
}

function draw()
{
    buttonCheck("a",0);
    buttonCheck("s",1);
    buttonCheck("d",2);
    buttonCheck("f",3);

    var  customer;
    while(customer = game.customerSprites.iterate()) 
    {
        customer.applyVelocity();
        customer.update();

        if(customer.y > (game.size.height))
        {
            game.customerSprites.remove(customer);
            customer.remove();
            game.satisfaction -= game.values[customer.id].rep;
            delete game.values[customer.id];

            propagateSatisfaction();
        }
    }

    if(game.satisfaction < 0.5)
    {
        game.satisfaction = 0;
        propagateSatisfaction();
        loseGame();
    }

    
    if (game.tickCounter % Math.round(50/game.player.level) == 0 && game.nextWaveAt && (new Date()).getTime() > game.nextWaveAt.getTime()) 
        showCustomer();
    if (game.nextWaveAt && (new Date()).getTime() < game.nextWaveAt.getTime()){
        game.ngScope.$apply(function() {
            game.ngScope.waveTimer = Math.ceil((game.nextWaveAt.getTime() - new Date().getTime())/1000);
        });
    }

    for(var i in game.buckets){
        var bucket = game.buckets[i];
        
        if(bucket.visible){
            for(var j in game.customerSprites.list){
                var customer = game.customerSprites.list[j];
                if(bucket.sprite.y - customer.y <= imageWidth * (1/2) && bucket.sprite.y - customer.y > -1 * imageWidth && Math.abs(bucket.sprite.x - customer.x) < 1){
                    bucket.disappear();
                    bucket.sprite.update();

                    addSatisfaction();
                    propagateSatisfaction();
                    game.player.addCash(game.values[customer.id].cash);
                    
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

    game.tickCounter++;

}
function checkPresence(index)
{
    var button = game.buttons.list[index];
    var presence = false;
    while(customer = game.customerSprites.iterate())
    {
        if(button.y - customer.y <= imageWidth * (3/4) && button.y - customer.y > -(imageWidth * (3/4)) && Math.abs(button.x - customer.x) < 1)
        {
            addSatisfaction();
            game.player.addCash(game.values[customer.id].cash);
            propagateSatisfaction();
            propagateCash();
            presence = true;
            
            game.customerSprites.remove(customer);
            customer.remove();         
            delete game.values[customer.id];
        }
    }

    if(!presence)
    {
        game.satisfaction--;
        propagateSatisfaction();
    }
}

function propagateSatisfaction() {
    game.ngScope.$apply(function(){game.ngScope.satisfaction = game.satisfaction;});
}

function propagateCash() {
    game.ngScope.$apply(function(){game.ngScope.player.cash = game.player.cash;});
}

function propagateCustomerNumbers() {
    game.ngScope.$apply(function(){game.ngScope.customerNumbers = game.customerNumbers;});
}

function initVariables()
{
    game.waveBreak = 3000;
    game.nextWaveAt = new Date();
    game.waveNumbers = [15, 30, 75, 150, 300, 750, 1500, 3000];
}
