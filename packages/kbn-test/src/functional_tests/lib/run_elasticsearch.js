/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { resolve } from 'path';
import { KIBANA_ROOT } from './paths';
import { createEsTestCluster } from '../../es';

import { setupUsers, DEFAULT_SUPERUSER_PASS } from './auth';

export async function runElasticsearch({ config, log }) {
  const isOss = config.get('esTestCluster.license') === 'oss';

  const cluster = createEsTestCluster({
    port: config.get('servers.elasticsearch.port'),
    password: !isOss
      ? DEFAULT_SUPERUSER_PASS
      : config.get('servers.elasticsearch.password'),
    license: config.get('esTestCluster.license'),
    log,
    basePath: resolve(KIBANA_ROOT, '.es'),
    from: config.get('esTestCluster.from'),
  });

  const esArgs = config.get('esTestCluster.serverArgs');

  await cluster.start(esArgs);

  if (!isOss) {
    await setupUsers(log, config);
  }

  return cluster;
}
