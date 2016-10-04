app.config(function($routeProvider) {
    $routeProvider
        .when("/main", {
            templateUrl : function(params){
                return '/resources/i18n/' + params.localization + '/main_page.html'
            }
        })
        .when("/catalog", {
                templateUrl : function(params){
                return '/catalog_page.html'
            }
        })
        .when('/info/:localization', {
            templateUrl : function(params){
                return '/resources/i18n/' + params.localization + '/info_page.html'
            }
        })
        .when("/doc/:localization", {
            templateUrl : function(params){
                return '/resources/i18n/' + params.localization + '/tech_doc_page.html'
            }
        })
        .when("/contacts/:localization", {
            templateUrl : function(params){
                return '/resources/i18n/' + params.localization +'/contacts_page.html'
            }
        })
        .otherwise({
            redirectTo: '/main'
        });
});