/* global angular */
import _ from 'lodash';
import watcherWebhookAction from './webhook-action.html';
import { app } from '../../app.module';

app.directive('webhookAction', function () {

  function actionDirective(scope, element, attrs) {

    scope.action = {
      type: 'webhook',
      title: attrs.name
    };

    if (_.has(scope.watcher._source.actions[attrs.name].webhook, 'headers')) {
      scope.watcher._source.actions[attrs.name].webhook.$$proxy = true;
      let headers = scope.watcher._source.actions[attrs.name].webhook.headers;
      scope.watcher._source.actions[attrs.name].webhook._headers = angular.toJson(headers, 'pretty');
    }

    scope.changeMethod = function (method) {
      scope.watcher._source.actions[attrs.name].webhook.method = method;
    };

    scope.enableExtraFields = function () {
      if (scope.watcher._source.actions[attrs.name].webhook.$$proxy) {
        scope.watcher._source.actions[attrs.name].webhook.headers = {};
        scope.watcher._source.actions[attrs.name].webhook._headers = '';
      } else {
        delete scope.watcher._source.actions[attrs.name].webhook.headers;
        delete scope.watcher._source.actions[attrs.name].webhook._headers;
      }
    };

  };

  return {
    restrict: 'E',
    template: watcherWebhookAction,
    scope: true,
    link: actionDirective
  };
});
