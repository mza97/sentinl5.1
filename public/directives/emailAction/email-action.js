import watcherEmailAction from './email-action.html';
import { app } from '../../app.module';

app.directive('emailAction', function () {
  function actionDirective(scope, element, attrs) {
    scope.action = {
      type: 'email'
    };
  }

  return {
    restrict: 'E',
    template: watcherEmailAction,
    scope: true,
    link: actionDirective
  };
});
