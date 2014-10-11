var hoboApp = angular.module('hoboApp', []);

hoboApp.controller('gameController', function($scope){
	$scope.employees=[
		{
			name:'Napoleon Bonerfarte', 
			description: 'Good at breaking bones. And phones.',
			price: 100000,
			count: 100,
			src: "img/employee1.png"
		},
		{
			name:'Durria Bananachin', 
			description: 'The Facebook addict.',
			price: 100000,
			count: 50,
			src: "img/employee2.png"
		}
	];
});