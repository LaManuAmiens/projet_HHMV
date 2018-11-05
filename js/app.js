// nous avons créé le module et l'avons injecté avec le module ngRoute et le module cart que nous avons créés
var app = angular.module("app", ['ngRoute','ng-Shop']);
// les routes que nous allons utiliser pour notre exemple
app.run(function($rootScope){
  $rootScope.subjectList = [];
  $rootScope.nameList = [];
  $rootScope.emailList = [];
  $rootScope.textList = [];
});
app.config(function($routeProvider)
{
	$routeProvider.when("/", {
		templateUrl : "home.html",
		controller : "homeController"
	})
	.when("/pay", {
		templateUrl : "pay.html",
		controller : "homeController",
	})
	.when("/form",{
	templateUrl: "form.html",
	controller: "formCtrl"
})
	.when("/view/:id?",{
	templateUrl: "view.html",
	controller: "viewCtrl"
})
	.otherwise({ reditrectTo : "/" });
});

app.controller("formCtrl", ["$scope", "$rootScope", function($scope, $rootScope){
  $scope.sendIt = function(){
// $rootScope sert à créer une variable accessible dans tout le document
    $rootScope.subjectList.push($scope.subject);
    $rootScope.nameList.push($scope.name);
    $rootScope.emailList.push($scope.email);
    $rootScope.textList.push($scope.text);
  }
}])
app.controller("viewCtrl", ["$scope", "$rootScope", "$routeParams", function($scope, $rootScope, $routeParams){
  $scope.id = $routeParams.id;
  $scope.subject = $rootScope.subjectList[$scope.id];
  $scope.name = $rootScope.nameList[$scope.id];
  $scope.email = $rootScope.emailList[$scope.id];
  $scope.text = $rootScope.textList[$scope.id];
}]);

app.controller("homeController", function($scope, $shop, $http)
{
	$http.get("voiture.json").then(function(res){
		$scope.mydata = res.data;
	});
	/*
	* - Nous établissons les données pour le formulaire paypal
	*/
	function userDataPayPal()
	{
		var userData = {};
		userData.cmd = "_cart";
		userData.upload = "1";
		userData.currencyCode = "EUR";
		userData.lc = "EU";
		userData.rm = 2;
		return userData;
	}
	/*
	* - ajouter x quantité d'un produit au panier
	* - object - s'il s'agit d'une nouvelle insertion, retourne une insertion, sinon met à jour
	*/
	$scope.add = function(producto)
	{
	// alert (produit.total); retour
		var product = {};
		product.id = producto.id;
		product.price = producto.price;
		product.name = producto.name;
		product.category = producto.category;
		product.qty = parseInt(producto.total || 1,10);
		$shop.add(product);
	}
	/*
	*  - Supprimer un produit du panier par son identifiant
	*/
	$scope.remove = function(id)
	{
		if($shop.remove(id))
		{
			alert("Produit retirer");
			return;
		}
		else
		{
			alert("Une erreur s'est produite lors de l'élimination du produit, sûrement parce qu'il n'existe pas");
			return;
		}
	}
	/*
	*  - supprimer le contenu du panier
	*/
	$scope.destroy = function()
	{
		$shop.destroy();
	}
	/*
	* - arrondissez le prix que nous vous donnons avec deux décimales
	*/
	$scope.roundCurrency = function(total)
	{
		return total.toFixed(2);
	}
	/*
	* -tableau d'objets avec des produits
	*/
	$scope.productosTienda =
	[
	{"id": 1, "category": "Detalles", "name": "Corée du nord", "price": 200, "picture": "imgs/corée.jpg"},
	{"id": 2, "category": "Detalles", "name": "Voyage dans l'espace", "price": 1500, "picture": "imgs/espace2.jpg"},
	{"id": 3, "category": "Detalles", "name": "Volcan", "price": 425.5, "picture": "imgs/volcan.jpeg"},
	{"id": 4, "category": "Detalles", "name": "La Tchetchenie", "price": 380.25, "picture": "imgs/tchetchenie2.jpg"},
	{"id": 5, "category": "Detalles", "name": "Les profondeurs", "price": 1000.2, "picture": "imgs/souslamer.jpg"}
	];
});
