app.config(function($routeProvider) {
    $routeProvider
        .when("/main", {
            templateUrl : "/home_page.html"
        })
        .when('/info/:localization', {
            templateUrl : function(params){
                return '/resources/i18n/info_page_' + params.localization +'.html'
            }
        })
        .when("/doc/:localization", {
            templateUrl : function(params){
                return '/resources/i18n/tech_doc_page_' + params.localization +'.html'
            }
        })
        .when("/contacts/:localization", {
            templateUrl : function(params){
                return '/resources/i18n/contacts_page_' + params.localization +'.html'
            }
        })
        .otherwise({
        redirectTo: '/main'
        });
});