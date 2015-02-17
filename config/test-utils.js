var TestUtil = {
	compile: function(html, initialScope) {
		var container;

		inject(function($compile, $rootScope) {
			if (angular.isDefined(initialScope)) {
				angular.extend($rootScope, initialScope);
			}

			container = $compile(html)($rootScope);
			$rootScope.$apply();
		});

		return container;
	}
};
