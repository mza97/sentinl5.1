import uiRoutes from 'ui/routes';

import template from './templates/index.html';
import about from './templates/about.html';
import alarms from './templates/alarms.html';
import reports from './templates/reports.html';

uiRoutes.enable();

uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/sentinl/example')
      .then((resp) => resp.data.time);
    }
  }
});

uiRoutes
.when('/alarms', {
  template: alarms,
  resolve: {
    currentTime($http) {
      return $http.get('../api/sentinl/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiRoutes
.when('/reports', {
  template: reports,
  resolve: {
    currentTime($http) {
      return $http.get('../api/sentinl/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiRoutes
.when('/about', {
  template: about
});
