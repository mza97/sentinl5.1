/*
 * Copyright 2016, Lorenzo Mangani (lorenzo.mangani@gmail.com)
 * Copyright 2015, Rao Chenlin (rao.chenlin@gmail.com)
 *
 * This file is part of Sentinl (http://github.com/sirensolutions/sentinl)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import later from 'later';
import _ from 'lodash';
import masterRoute from './server/routes/routes';
import getScheduler from './server/lib/scheduler';
import helpers from './server/lib/helpers';
import getElasticsearchClient from './server/lib/get_elasticsearch_client';
import getConfiguration from './server/lib/get_configuration';
import fs from 'fs';

const init = _.once((server) => {
  const config = getConfiguration(server);
  const scheduler = getScheduler(server);

  if (fs.existsSync('/etc/sentinl.json')) {
    server.plugins.sentinl.status.red('Setting configuration values in /etc/sentinl.json is not supported anymore, please copy ' +
                                      'your Sentinl configuration values to config/kibi.yml or config/kibana.yml, ' +
                                      'remove /etc/sentinl.json and restart.');
    return;
  }

  server.log(['status', 'info', 'Sentinl'], 'Sentinl Initializing');
  server.sentinlStore = [];

  masterRoute(server);

  // Create Sentinl Indices, if required
  helpers.createSentinlIndex(server, config);
  helpers.createSentinlAlarmIndex(server, config);

  /* Bird Watching and Duck Hunting */
  const { callWithRequest } = getElasticsearchClient(server);
  var sched = later.parse.recur().on(25,55).second();
  var t = later.setInterval(function () { scheduler.doalert(server, callWithRequest); }, sched);
  /* run NOW, plus later */
  scheduler.doalert(server, callWithRequest);
});

export default function (server, options) {

  let status = server.plugins.elasticsearch.status;
  if (status && status.state === 'green') {
    init(server);
  } else {
    status.on('change', () => {
      if (server.plugins.elasticsearch.status.state === 'green') {
        init(server);
      }
    });
  }

};
