var hoboApp = angular.module('hoboApp', []);

hoboApp.controller('gameController', function($scope){
	
	$scope.employees = [
		new Employee(
			'Napoleon Bonerfarte',
			'Good at breaking bones. And phones.',
			"email",
			100000,
			100,
			"img/employee1.png"
		),
		new Employee(
			'Durria Bananachin', 
			'The Facebook addict.',
			"email",
			100000,
			50,
			"img/employee3.png"
		),
		new Employee(
			'Kazimir Waffles', 
			'Bird brain.',
			"email",
			100000,
			2,
			"img/employee2.png"
		),
		new Employee(
			'Nigel Nybbles', 
			'Good old-fashioned postage.',
			"email",
			19889,
			50,
			"img/employee4.png"
		)
	];

	$scope.player = new Player(100,1000000);

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
		}]

});