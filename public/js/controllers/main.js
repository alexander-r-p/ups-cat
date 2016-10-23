/**
 * Created by Alexander on 20.06.2016.
 */
app.controller('StoreController', ['$scope', '$rootScope', 'translationService', '$mdDialog', '$sce', '$http', '$mdToast', '$animate', function ($scope, $rootScope, translationService, $mdDialog, $sce, $http, $mdToast, $animate) {
    //$scope.imageIndex = 0;
    $scope.currentNavItem = 'home';
    var currentProduct;
    var imgSrc;

    $scope.getImageSrc = function (name, index) {
        return name + index + ".jpg";
    }

    $scope.readAsHTML = function (snippet) {
        return readTextAsHTML(snippet);
    }

    var readTextAsHTML = function (snippet) {
        return $sce.trustAsHtml(snippet);
    }

    $scope.goto = function (navItem) {
        $scope.currentNavItem = navItem;
    }

    $scope.currentImageChange = function (product, imageNumber) {
        console.log(imageNumber);
        product.currentImageIndex = imageNumber || 0;
    };

    $scope.showFullImg = function (index, ev) {
        imgSrc = $scope.getImageSrc('/img/product_img/img_full_', index + 1)
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/full_img_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.showAdvanced = function (product, ev) {
        currentProduct = product;
        console.log(ev);
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/product_description_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.showShoppingCart = function (event) {
        $rootScope.order = loadOrderFromStorage();
        $mdDialog.show({
                controller: ShoppingCartController,
                templateUrl: '/shop-cart.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.addToShopCart = function (product, event) {
        console.log(event);
        //localStorage.removeItem("productsInCart");
        if (typeof(Storage) !== "undefined") {
            $rootScope.order = loadOrderFromStorage();
            if ($rootScope.order.products === null) {
                ++product.quantity;
                $rootScope.order.products = new Array(product);
            }
            if (!isProductAlreadyInCart($rootScope.order.products, product)) {
                ++product.quantity;
                $rootScope.order.products.push(product);
            }
            saveOrderToStorage($rootScope.order);

            $mdToast.show(
                $mdToast.simple()
                    .content('Товар отправлен в корзину')
                    .position($scope.getToastPosition())
                    .hideDelay(5000)
            );

        } else {
            // Sorry! No Web Storage support..
        }
    };

    var isProductAlreadyInCart = function (productsInCart, product) {
        if (productsInCart == null) return false;
        for (var i = 0; i < productsInCart.length; i++) {
            if (productsInCart[i].name === product.name) return true;
        }
        return false;
    }

    function loadOrderFromStorage() {
        if (typeof(Storage) !== "undefined") {
            var order = JSON.parse(localStorage.getItem("order"));
            if (order === null) {
                return $rootScope.order
            }
        }
        return order;
    };

    function saveOrderToStorage(order) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("order", JSON.stringify(order));
        }
    };

    function ShoppingCartController($scope, $mdDialog) {
        $scope.getOrder = function () {
            return $rootScope.order;
        };

        $scope.hide = function () {
            saveOrderToStorage($rootScope.order);
            $mdDialog.hide();
        };

        $scope.removeItemFromOrder = function(productsInCart, product) {
            var index = productsInCart.indexOf(product);
            if (index > -1) {
                productsInCart.splice(index, 1);
            }
            $rootScope.order.products = productsInCart;
            saveOrderToStorage($rootScope.order);
        };

        $scope.calculateTotalSum = function(productsInCart) {
            var sum = 0;
            for (var i = 0; i < productsInCart.length; i++) {
                sum = sum + (productsInCart[i].quantity * productsInCart[i].price);
            }
            return sum;
        };

        $scope.cancel = function () {
            $rootScope.order.products = [];
            saveOrderToStorage($rootScope.order);
            $mdDialog.hide();
        };

        $scope.submit = function () {
            $mdDialog.hide();
            saveOrderToStorage($rootScope.order);
            sendMail($rootScope.order);
        };
    };

    $scope.getItemsQuantityInShoppingCart = function(){
        return countItemsInCart();
    }

    function countItemsInCart() {
        var prod = loadOrderFromStorage().products;
        var sum = 0;
        for (var i = 0; i < prod.length; i++) {
            sum = sum + prod[i].quantity;
        }
        return sum;
    }

    $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.getToastPosition = function () {
        return Object.keys($scope.toastPosition)
            .filter(function (pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
    };

    function sendMail(order) {
        // Simple POST request example (passing data) :
        $http.post('/sendMail', order).
        success(function (data, status, headers, config) {
            $mdToast.show(
                $mdToast.simple()
                    .content(order.name + ', Ваш заказ отправлен, Спасибо!')
                    .position($scope.getToastPosition())
                    .hideDelay(10000)
            );
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    };

    function DialogController($scope, $mdDialog) {
        $scope.getImage = function () {
            return imgSrc;
        };

        $scope.getCurrentProduct = function () {
            return currentProduct;
        };

        $scope.parseHTML = function (snippet) {
            return readTextAsHTML(snippet);
        };

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    };

    $rootScope.order = {
        products: [],
        name: "",
        email: "",
        phone: "",
        message: ""
    };

    $scope.products = [{
        name: 'UPS Type A 500',
        description: "<ul><li>Стабилизатор</li><li>индикатор напряжения</li></ul>",
        voltage: "12V",
        capacity: "350W",
        maxCapacity: "500W",
        price: 2300,
        currentImageIndex: 0,
        quantity: 0,
        images: [
            "/img/ups-a-01.png",
            "/img/ups-a-02.png",
            "/img/ups-a-03.png"
        ]
    }, {
        name: 'UPS Type B 700',
        description: "<ul><li>Стабилизатор</li><li>Индикатор напряжения</li><li>Зарядка с функцией «Вампир» для использования различных источников енергии (солнечной, термопреобразователей, доп.аккумулятора для зарядки основного)</li> <li>Выход сигнала на включение внешнего генератора електроэнергии</li><li>Выход для подключения GSM сигнализации</li></ul>",
        voltage: "12V",
        capacity: "450W",
        maxCapacity: "700W",
        price: 3200,
        currentImageIndex: 0,
        quantity: 0,
        images: [
            "/img/ups-a-01.png",
            "/img/ups-a-02.png",
            "/img/ups-a-03.png"
        ]
    }, {
        name: 'UPS Type C 1000',
        description: "<ul><li>Стабилизатор</li><li>Индикатор напряжения</li><li>Солнечная зарядка с функцией PPM (поиска точки максимальной мощности) мощной солнечной батареи</li><li>Выход сигнала на включение внешнего генератора електроэнергии</li><li>Выход для подключения GSM сигнализации</li></ul>",
        voltage: "12V",
        capacity: "600W",
        maxCapacity: "1000W",
        price: 3600,
        currentImageIndex: 0,
        quantity: 0,
        images: [
            "/img/ups-a-01.png",
            "/img/ups-a-02.png",
            "/img/ups-a-03.png"
        ]
    }, {
        name: 'UPS Type D 1000',
        description: "<ul><li>Стабилизатор</li><li>Индикатор напряжения</li><li>Солнечная зарядка с функцией PPM (поиска точки максимальной мощности) мощной солнечной батареи</li><li>Выход сигнала на включение внешнего генератора електроэнергии</li><li>Выход для подключения GSM сигнализации</li></ul>",
        voltage: "24V",
        capacity: "700W",
        maxCapacity: "1000W",
        price: 3700,
        currentImageIndex: 0,
        quantity: 0,
        images: [
            "/img/ups-a-01.png",
            "/img/ups-a-02.png",
            "/img/ups-a-03.png"
        ]
    }];

    $scope.translate = function () {
        translationService.getTranslation($scope, $scope.selectedLanguage);
    };
    //Init
    $scope.selectedLanguage = 'ru';
    $scope.translate();
}]);

app.controller("ReviewController", ['$scope', function () {
    this.review = {};
    this.addReview = function (product) {
        this.review.createdOn = Date.now();
        product.reviews.push(this.review);
        this.review = {};
    };
}]);