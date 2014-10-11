var hoboApp = angular.module('hoboApp', []);

hoboApp.controller('gameController', function($scope){
	
	$scope.employees = [
		new Employee(
			'Napoleon Bonerfarte',
			'Good at breaking bones. And phones.',
			"email",
			1000,
			0,
			"img/employee1.png"
		),
		new Employee(
			'Durria Bananachin', 
			'The Facebook addict.',
			"email",
			1000,
			0,
			"img/employee3.png"
		),
		new Employee(
			'Kazimir Waffles', 
			'Bird brain.',
			"email",
			1000,
			0,
			"img/employee2.png"
		),
		new Employee(
			'Nigel Nybbles', 
			'Good old-fashioned postage.',
			"email",
			1000,
			0,
			"img/employee4.png"
		)
	];

	$scope.player = new Player(1,10000);
	game.player = $scope.player;
	game.employees = $scope.employees;

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
		$scope.player.addCash(-employee.price);
		employee.addCount();
		employee.increasePrice();
	};

});