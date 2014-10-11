
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
	price = 5;
	employees = new Array();
	employees[0] = new Employee("Andrea",0,1,"email",price);
	employees[1] = new Employee("Nick",0,1,"facebook",price);
	employees[2] = new Employee("Andy",0,1,"tweeter",price);
	employees[3] = new Employee("Kaj",0,1,"phone",price);
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
	buckets[0] = new Bucket(false,"email");
	buckets[1] = new Bucket(false,"facebook");
	buckets[2] = new Bucket(false,"tweeter");
	buckets[3] = new Bucket(false,"phone");
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