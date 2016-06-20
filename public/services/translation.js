app.service('translationService', function($resource) {
    this.getTranslation = function($scope, language) {
        var languageFilePath = 'resources/i18n/translation_' + language + '.json';
        console.log(languageFilePath);
        $resource(languageFilePath).get(function (data) {
            $scope.translation = data;
        });
    };
});