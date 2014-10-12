game = {
    types: ["phone","mail","facebook","twit"], 
    values: {}, 
    wave: [], 
    customerNumbers: [0,0,0,0],
    running: false, 
    imageWidth: 64, 
    bufferOffset: 15, 
    customers: [],
    customerSprites: sjs.List(),
    buttonSprites: sjs.List(),
    tickCounter: 0,
    reputation: 50,
    buttonStates: [1,1,1,1],
    buckets: [],
    waveBreak: 3000
};

//Generates customers
function addCustomer() {
    var customer = new Customer();
    game.values[customer.sprite.id] = customer.getValues();

    game.wave.push(customer);
    game.customerNumbers[customer.type]++;
}

function showCustomer() {
    var customer = game.wave.pop();
    game.customerNumbers[customer.type]--;
    game.customerSprites.add(customer.sprite);
    propagateCustomerNumbers();
    
    if(game.wave.length == 0){ initWave(); }
}

function initWave() {
    game.nextWaveAt = new Date();
    game.waveNumbers = [15, 30, 75, 150, 300, 750, 1500, 3000];
    game.nextWaveAt.setTime(game.nextWaveAt.getTime() + game.waveBreak);

    game.player.levelUp();
    for(var i = 0; i < game.waveNumbers[game.player.level-1]; i++) {
        addCustomer();   
    }
    setTimeout(function(){propagateCustomerNumbers();},10);
}

function initBuckets(){
    for(var i = 0; i < 4; i++){
        var bucket = new Bucket(game.employees[i], i);
        bucket.disappear(true);
        game.buckets.push(bucket);
    }
}

function initButtons() {
    buttonLabels = ["A","S","D","F"];

    for(var i in buttonLabels) {
        var button  = game.scene.Sprite("img/btn-"+buttonLabels[i]+".png", game.buttonLayer);
        button.move(game.positions[i], 500);
        button.size(game.imageWidth, game.imageWidth);
        button.update();
        game.buttonSprites.add(button);
    }

}

$(document).ready(function () 
{
    $container = $("#canvas-container");

    game.size = {width: $container.innerWidth(), height: $container.innerWidth()};
    game.scene = sjs.Scene({w: game.size.width, h: game.size.height, parent: $container[0]});
    game.layer = game.scene.Layer("front");
    game.buttonLayer = game.scene.Layer("buttons");
    game.input = game.scene.Input();
    game.ticker = game.scene.Ticker(draw);
    
    var gap = game.size.width/8;
    var center = game.imageWidth/2;
    var offset = game.bufferOffset;
    game.positions = [gap-center-offset, gap*3-center-offset, gap*5-center-offset, gap*7-center-offset];
    
    propagateReputation();

    initBuckets();
    initButtons();
});

function loseGame() {
    console.log('The game has been LOST.');
    game.running = false;

    $('#nooo')[0].play();
    $("#game-over-box").fadeIn();
    var customer;
    while(customer = game.customerSprites.iterate()){
        customer.remove();
    }
    for (var j = 0; j < game.buckets.length; j++) {
        game.buckets[j].sprite.remove();
    };
    game.ticker.pause();
}

function checkButtons() {
    buttonCheck("a",0);
    buttonCheck("s",1);
    buttonCheck("d",2);
    buttonCheck("f",3);
}

function buttonCheck(character, index) {
    if(game.input.keyPressed(character) && game.buttonStates[index]) {
        pressButton(index);
        checkPresence(index);

        setTimeout(function() {
            unpressButton(index);
        },200)
    }
}

function pressButton(index) {
    game.buttonSprites.list[index].setYOffset(game.imageWidth);
    game.buttonSprites.list[index].update();
    game.buttonStates[index] = 0;
}

function unpressButton(index) {
    game.buttonStates[index] = 1;
    game.buttonSprites.list[index].setYOffset(0);
    game.buttonSprites.list[index].update();
}

function addReputation(value){
    var value = value || 1;
    if (game.reputation + value <= 100) {
        game.reputation += value;
    }
    propagateReputation();
}

function removeReputation(value){
    var value = value || 1;
    game.reputation -= value;
    if (game.reputation <= 0) {
        game.reputation = 0;
        propagateReputation();
        loseGame();  
    }else{
        propagateReputation();
    }
}

function draw() {
    checkButtons();
    checkLostCustomers();
    spawnCustomer();
    checkBucketCollisions();
}

function spawnCustomer() {
    if (game.tickCounter % Math.round(50/game.player.level) == 0 && game.nextWaveAt && (new Date()).getTime() > game.nextWaveAt.getTime()){
        showCustomer();
    }

    if (game.nextWaveAt && (new Date()).getTime() < game.nextWaveAt.getTime()){
        game.ngScope.$apply(function() {
            game.ngScope.waveTimer = Math.ceil((game.nextWaveAt.getTime() - new Date().getTime())/1000);
        });
    }

    game.tickCounter++;
}

function checkLostCustomers() {
    var  customerSprite;
    while(customerSprite = game.customerSprites.iterate())
    {
        if(!customerSprite.layer) { return;W }
        customerSprite.applyVelocity();
        customerSprite.update();

        if(customerSprite.y > (game.size.height)) {
            removeReputation(game.values[customerSprite.id].reputation);
            removeCustomer(customerSprite);
        }
    }
}

function checkBucketCollisions() {
    for(var i in game.buckets){
        var bucket = game.buckets[i];
        
        if(bucket.visible){
            for(var j in game.customerSprites.list){
                var cusomerSprite = game.customerSprites.list[j];
                if(bucket.sprite.y - cusomerSprite.y <= game.imageWidth * (1/2) && bucket.sprite.y - cusomerSprite.y > -1 * game.imageWidth && Math.abs(bucket.sprite.x - cusomerSprite.x) < 1){
                    bucket.disappear(true);
                    customerSuccess(cusomerSprite);
                }
            }
        }else{
            if(bucket.shouldAppear()){
                bucket.appear(true);
            }    
        }
    }
}

function customerSuccess(customerSprite) {
    addReputation();
    game.player.addCash(game.values[customerSprite.id].reward);
    propagateCash();
    removeCustomer(customerSprite);
}

function removeCustomer(customerSprite) {
    game.customerSprites.remove(customerSprite);
    customerSprite.remove();
    delete game.values[customerSprite.id];
}

function checkPresence(index) {
    var button = game.buttonSprites.list[index];
    var presence = false;
    var customer;
    while(customer = game.customerSprites.iterate()) {
        if(button.y - customer.y <= game.imageWidth * (3/4) && button.y - customer.y > -(game.imageWidth * (3/4)) && Math.abs(button.x - customer.x) < 1) {
            customerSuccess(customer);
            presence = true;
        }
    }

    if(!presence) {
        removeReputation();
    }
}

function propagateReputation() {
    game.ngScope.$apply(function(){game.ngScope.reputation = game.reputation;});
}

function propagateCash() {
    game.ngScope.$apply(function(){game.ngScope.player.cash = game.player.cash;});
}

function propagateCustomerNumbers() {
    game.ngScope.$apply(function(){game.ngScope.customerNumbers = game.customerNumbers;});
}
