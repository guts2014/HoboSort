
/*types = ["email","facebook","twitter","phone"];
names = ["Andrea","Nick","Andy","Kaj"];
prices = [5,5,5,5]; */

function Employee(name, desc, type, price, count, img) {
	this.name = name;
	this.count = count;
	this.type = type;
	this.price = price;
	this.img = img;
	this.desc = desc;
}

Employee.prototype.addCount = function(){this.count = this.count + 1;}
Employee.prototype.addDegree = function(){this.degree = this.degree + 1;}
Employee.prototype.increasePriceBy = function(money){this.price = this.price + money;}


function Bucket(employee) {
	this.on = false;
	this.employee = employee;
}

Bucket.prototype.disappear = function(){
	this.on = false;
	var interval = -this.employee.count/10 + 10;
	this.appearAt = new Time();
	this.appearAt.setTime((new Time()).getTime() + (interval*1000));
}

Bucket.prototype.appear = function() {
	this.on = true;
}


function Player(level, cash) {
	this.level = level;
	this.cash = cash;
}

Player.prototype.levelUp = function(){this.level = this.level + 1;}
Player.prototype.addCash = function(earn){this.cash = this.cash + earn;}
