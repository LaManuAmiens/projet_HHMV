var shop = angular.module('ng-Shop', []);
// retourne un objet avec toutes les fonctionnalités qu'un panier doit avoir
shop.factory('$shop', ['$rootScope', function ($rootScope)
{
	/**
	* @var array avec le contenu du panier
	*/
	$rootScope.udpShopContent = [],
	/**
	* @var float avec le prix total du panier
	*/
	$rootScope.udpShopTotalPrice = 0,
	/**
	* @var integer avec le nombre d'articles dans le panier
	*/
	$rootScope.udpShopTotalProducts = 0;
	return{
		/**
		* - vérifier les champs que nous introduisons lors de l'ajout de produits
		*/
		minimRequeriments: function(product)
		{
			if(!product.qty || !product.price || !product.id)
			{
				throw new Error("Les champs quantité, prix et identifiant sont nécessaires");
			}
			if(isNaN(product.qty) || isNaN(product.price) || isNaN(product.id))
			{
				throw new Error("Les champs qty, price et id doivent être numériques");
			}
			if(product.qty <= 0)
			{
				throw new Error("Le montant ajouté doit être supérieur à 0");
			}
			if(this.isInteger(product.qty) === false)
			{
				throw new Error("La quantité du produit doit être un nombre entier");
			}
		},
		/**
		* - vérifier si le dernier nombre est un entier
		*/
		isInteger: function(n)
		{
			if(n % 1 === 0)
			return true;
			else
			return false;
		},
		/**
		* - ajouter de nouveaux produits au panier
		* - tableau avec les données du produit
		*/
		add: function(producto)
		{
			try{
				// nous vérifions si le produit répond aux exigences
				this.minimRequeriments(producto);

				// Si le produit existe, nous mettons à jour la quantité
				if(this.checkExistsProduct(producto,$rootScope.udpShopContent) === true)
				{
					$rootScope.udpShopTotalPrice += parseFloat(producto.price * producto.qty,10);
					$rootScope.udpShopTotalProducts += producto.qty;
					return {"msg":"updated"};
				}
				// sinon, on l'ajoute au panier
				else
				{
					$rootScope.udpShopTotalPrice += parseFloat(producto.price * producto.qty,10);
					$rootScope.udpShopTotalProducts += producto.qty;
					$rootScope.udpShopContent.push(producto);
					return {"msg":"insert"};
				}
			}
			catch(error)
			{
				alert("Attention " + error);
			}
		},
		/**
		*  Vérifier si le produit existe dans le panier
		* product - objecto avec les données de produit à ajouter
		*  produits - tableau avec contenu du panier
		*/
		checkExistsProduct: function(product, products)
		{
			var i, len;
			for (i = 0, len = products.length; i < len; i++)
			{
				if (products[i].id === product.id)
				{
					products[i].qty += product.qty;
					return true;
				}
			}
			return false;
		},
		/**
		*  -supprimer un produit complet par son identifiant
		*  int - identifiant du produit
		*/
		remove: function(id)
		{
			try{
				var i, len;
				for (i = 0, len = $rootScope.udpShopContent.length; i < len; i++)
				{
					if ($rootScope.udpShopContent[i].id === id)
					{
						$rootScope.udpShopTotalPrice -= parseFloat($rootScope.udpShopContent[i].price * $rootScope.udpShopContent[i].qty,10);
						$rootScope.udpShopTotalProducts -= $rootScope.udpShopContent[i].qty;
						$rootScope.udpShopContent.splice(i, 1);
						if(isNaN($rootScope.udpShopTotalPrice))
						{
							$rootScope.udpShopTotalPrice = 0;
						}
						return {"msg":"deleted"};
					}
				}
			}
			catch(error)
			{
				alert("Attention " + error);
			}
		},
		/**
		*  supprime tout le contenu du panier, le prix total et les produits
		*/
		destroy: function()
		{
			try{
				$rootScope.udpShopContent = [];
				$rootScope.udpShopTotalPrice = 0;
				$rootScope.udpShopTotalProducts = 0;
			}
			catch(error)
			{
				alert("Attention " + error);
			}
		},

		dataPayPal: function(userData)
		{
			var htmlForm = "";
			for (var i = 0, len = $rootScope.udpShopContent.length; i < len; i++)
			{
				var product = $rootScope.udpShopContent[i];
				var currentProduct = i + 1;
				htmlForm += "<input type='hidden' name='item_number_"+currentProduct+"' value="+product.id+" />";
				htmlForm += "<input type='hidden' name='item_name_"+currentProduct+"' value='"+product.name+"' />";
				htmlForm += "<input type='hidden' name='quantity_"+currentProduct+"' value="+product.qty+" />";
				htmlForm += "<input type='hidden' name='amount_"+currentProduct+"' value="+product.price.toFixed(2)+" />";
			}
			$(userData.formClass).html("").append(htmlForm);
		}
	};
}]);
