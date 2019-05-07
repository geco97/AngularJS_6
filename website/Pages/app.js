(function () {
    angular
        .module("angularApp", ["ngRoute", "ngCookies"])
        .controller("restapiController",restapiController)
        .controller("ListViewController",ListViewController)
        .controller("GridViewController",GridViewController)
        .config(config)
        .run(run);

    config.$inject = ["$routeProvider", "$locationProvider"];
    function config($routeProvider, $locationProvider) {
        $routeProvider
        .when("/", { 
            templateUrl: "website/views/ColumnView.html",
            controller: "GridViewController" 
        })
        .when("/ColumnView", { 
            templateUrl: "website/views/ColumnView.html",
            controller: "GridViewController" 
        })
    
        .when("/ListView", { 
            templateUrl: "website/views/ListView.html",
            controller: "ListViewController" 
        })
        .when("/Login", {
            controller: "loginController",
            templateUrl: "website/Pages/Partials/Login/login.view.html",
            controllerAs: "vm"                
        })
        .when("/Minsida", {
            controller: "homeController",
            templateUrl: "website/Pages/Partials/Home/home.view.html",
            controllerAs: "vm"                
        })
        .when("/Register", {
            controller: "registerController",
            templateUrl: "website/Pages/Partials/Register/register.view.html",
            controllerAs: "vm"                
        })
       
        .otherwise({ redirectTo: "/" });             
    }

    run.$inject = ["$rootScope", "$location", "$cookies", "$http"];
    function run($rootScope, $location, $cookies, $http) {

        $rootScope.globals = $cookies.getObject("globals") || {};
        if ($rootScope.globals.currentUser) {
             $http.defaults.headers.common["Authorization"] = 'Basic ' +  $rootScope.globals.currentUser.token;
            console.log($http.defaults.headers.common["Authorization"])
        }

        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            var restrictedPage = $.inArray($location.path(), ["/Login", "/Register","/ListView","/ColumnView"]) === -1;
            
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path("/");
            }
        })
    }
    ListViewController.$inject = ["$scope"];
    function ListViewController ($scope) {
        $scope.pagetitle = "Home";
        $scope.search = function(item) {
            if($scope.searchText == undefined) {
                return true;
            }
            else {
                if(
                    item.manufacturer.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                    item.productname.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                    item.Category.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1
                ) {
                    return true;
                }
            }
    
            return false;
        }
    }
    GridViewController.$inject = ["$scope"];
    function GridViewController($scope) {
            $scope.pagetitle = "Home";
            $scope.search = function(item) {
                if($scope.searchText == undefined) {
                    return true;
                }
                else {
                    if(
                        item.manufacturer.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                        item.productname.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                        item.Category.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1
                    ) {
                        return true;
                    }
                }
        
                return false;
            }
        }
        restapiController.$inject = ["$rootScope", "$scope", "$cookies", "$http"];
        function restapiController($scope ,$rootScope, $cookies, $http) {
            $http.get('http://localhost:5055/products')
            .then(function(res) {    
                $scope.namelist = res.data;
            });
            $rootScope.globals = $cookies.getObject("globals") || {};
            if ($rootScope.globals.currentUser) {
                $scope.Login="Min Sida";
                $scope.LoginUrl="Minsida";
            }
               else{
                  $scope.Login="Log in";
                  $scope.LoginUrl="Login";
                }
            $scope.filterFields = ['productname', 'Category', 'manufacturer']; 
            $scope.sortColumn = "productname";
            $scope.rowLimits = "10";
             $scope.rowLimitArr = [
               {id: "5",name: "5"},
               {id: "10",name: "10"},
               {id: "20",name: "20"},
               {id: "50",name: "50"},
               {id: "100",name: "100"},
            ];
            $scope.Logout = function(currentUser){
                $cookies.remove("globals");
                window.location.reload();
            }
            $scope.search = function(item) {
                if($rootScope.searchText == undefined) {
                    return true;
                }
                else {
                    if(
                        item.manufacturer.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                        item.productname.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                        item.Category.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1
                    ) {
                        return true;
                    }
                }
        
                return false;
            }
            $rootScope.cartComponent = "components/cart.component.html"
            $scope.changeView = function(view) {
                $scope.productComponent = "../components/" + view;
            }
            $(window).scroll(function() {
                let topPosition = $(this).scrollTop();
                if(topPosition > 100) {
                    $(".scrollTop").css("opacity","1");
                } else {
                    $(".scrollTop").css("opacity","0");
                }
            })
            const starsTotal = 5;
                $scope.rating = function (input) {
                    return Math.round(((input / starsTotal) * 100) / 10) * 10 + '%';
        
                }
                var getProductId = function(items, id) {
                    return _.find(items, function(item) {
                        return item.id === id
                    });
                };
                $scope.cart = $cookies.getObject("cart") || [];
                console.log($scope.cart);
                //$scope.cart = [];
                $scope.emptycart = "";
                $scope.addItem = function(item) {
                    console.log(item);
                    var found = getProductId($scope.cart, item.id);
                    console.log(found);
                    if(found) {
                        found.quantity += item.quantity;
                        console.log(found);
                    }
                    else {
                        $scope.cart.push(angular.copy(item));
                        var cookieExp = new Date();
                        cookieExp.setDate(cookieExp.getDate() + 7);
                        $cookies.putObject("cart", $scope.cart, { expires: cookieExp });
                    }
                }
        
                $scope.removeItem = function(item) {
                    var index = $scope.cart.indexOf(item);
                    $scope.cart.splice(index, 1);
                }
        
                $scope.addProductQuantity = function(item) {
                    item.quantity = item.quantity + 1;
                }
        
                $scope.subProductQuantity = function(item) {
                   item.quantity = item.quantity - 1;
                }
        
                $scope.getProductCost = function(item) {
                    return item.quantity * item.price;
                }
        
                $scope.getProductQuantity = function(item) {
                    return item.quantity;
                }
        
                $scope.getTotal = function() {
                    var total = _.reduce($scope.cart, function(sum, item) {
                        return sum + $scope.getProductCost(item);
                    }, 0);
        
                    if($scope.cart.length === 0) {
                        $scope.emptycart = "Your cart is empty."
                    }
                    else {
                        $scope.emptycart = ""
                    }   
                    return total;
                }
        
                $scope.getQuantity = function() {
                    var quantity = _.reduce($scope.cart, function(sum, item) {
                        return sum + $scope.getProductQuantity(item);
                    }, 0);
         
                    if(quantity === 0) {
                        $scope.badgeColor = "badge-secondary"
                    } else {
                        $scope.badgeColor = "badge-danger"
                    }
        
        
                    return quantity;
                }
        }  
        function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return 0;
}
})();
