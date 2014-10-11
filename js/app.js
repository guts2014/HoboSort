var hoboApp = angular.module('hoboApp', []);

hoboApp.controller('gameController', function($scope){
	
	$scope.employees = [
		new Employee(
			'Napoleon Bonerfarte',
			'Good at breaking bones. And phones.',
			"phone",
			1000,
			0,
			"img/employee1.png"
		),
		new Employee(
			'Durria Bananachin', 
			'The Facebook addict.',
			"mail",
			1000,
			0,
			"img/employee3.png"
		),
		new Employee(
			'Kazimir Waffles', 
			'Bird brain.',
			"facebook",
			1000,
			0,
			"img/employee2.png"
		),
		new Employee(
			'Nigel Nybbles', 
			'Good old-fashioned postage.',
			"twit",
			1000,
			0,
			"img/employee4.png"
		)
	];

	$scope.player = new Player(1,10000);
	game.player = $scope.player;
	game.employees = $scope.employees;
	game.ngScope = $scope;
	$scope.satisfaction = 50;

	$scope.icons=[
		{
			src: "img/phone.png"
		},
		{
			src: "img/mail.png"
		},
		{
			src: "img/facebook.png"
		},
		{
			src: "img/twit.png"
		}
	];

	$scope.buyEmployee = function(employee) {
		if ($scope.player.canAfford(employee)) {
			$scope.player.addCash(-employee.price);
			employee.addCount();
			employee.increasePrice();
		}
	};

});