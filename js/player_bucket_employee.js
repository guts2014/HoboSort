
types = ["email","facebook","twitter","phone"];
names = ["Andrea","Nick","Andy","Kaj"];
prices = [5,5,5,5];

function Employee(name, count, degree, type, price) {
	this.name = name;
	this.count = count;
	this.degree = degree;
	this.type = type;
	this.price = price;
}

Employee.prototype.getName = function(){return this.name;}
Employee.prototype.getCount = function(){return this.count;}
Employee.prototype.getDegree = function(){return this.degree;}
Employee.prototype.getType = function(){return this.type;}
Employee.prototype.getPrice = function(){return this.price;}

Employee.prototype.addCount = function(){this.count = this.count + 1;}
Employee.prototype.addDegree = function(){this.degree = this.degree + 1;}
Employee.prototype.increasePriceBy = function(money){this.price = this.price + money;}

function initEmployees(){
	employees = new Array();
	for (i=0; i<4; i++) {
		employees[i] = new Employee(names[i],0,1,types[i],prices[i]);
	}
	return employees;
}



function Bucket(on, type) {
	this.on = on;
	this.type = type;
}

Bucket.prototype.isOn = function(){return this.on;}
Bucket.prototype.getType = function(){return type;}

function initBuckets(){
	buckets = new Array();
	for (i=0; i<4; i++) {
		buckets[i] = new Bucket(false, types[i]);
	}
	return buckets;
}



function Player(level, cash) {
	this.level = level;
	this.cash = cash;
}

Player.prototype.getLevel = function(){return this.level;}
Player.prototype.getCash = function(){return this.cash;}

Player.prototype.levelUp = function(){this.level = this.level + 1;}
Player.prototype.addCash = function(earn){this.cash = this.cash + earn;}

Player.prototype.initPlayer() = function(){return new Player(1,0);}
