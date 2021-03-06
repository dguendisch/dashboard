//
// Copyright (c) 2019 by SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the LICENSE file
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict'

const _ = require('lodash')
const kubernetes = require('../kubernetes')
const Resources = kubernetes.Resources
const garden = kubernetes.gardener()
const { PreconditionFailed } = require('../errors')
const shoots = require('./shoots')
const { getProjectByNamespace } = require('../utils')
const authorization = require('./authorization')

const PROJECT_INITIALIZATION_TIMEOUT = 30 * 1000

function Core ({ auth }) {
  return kubernetes.core({ auth })
}

function Garden ({ auth }) {
  return kubernetes.gardener({ auth })
}

function fromResource ({ metadata, spec = {} }) {
  const role = 'project'
  const { name, resourceVersion, creationTimestamp } = metadata
  const { namespace, createdBy, owner, description, purpose } = spec
  return {
    metadata: {
      name,
      namespace,
      resourceVersion,
      role,
      creationTimestamp
    },
    data: {
      createdBy: fromSubject(createdBy),
      owner: fromSubject(owner),
      description,
      purpose
    }
  }
}

function toResource ({ metadata, data = {} }) {
  const { apiVersion, kind } = Resources.Project
  const { name, namespace, resourceVersion } = metadata
  const { createdBy, owner } = data

  const description = data.description || null
  const purpose = data.purpose || null

  return {
    apiVersion,
    kind,
    metadata: {
      name,
      resourceVersion
    },
    spec: {
      namespace,
      createdBy: toSubject(createdBy),
      owner: toSubject(owner),
      description,
      purpose
    }
  }
}

function fromSubject ({ name } = {}) {
  return name
}

function toSubject (username) {
  if (username) {
    return {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: 'User',
      name: username
    }
  }
}

async function validateDeletePreconditions ({ user, namespace }) {
  const shootList = await shoots.list({ user, namespace })
  if (!_.isEmpty(shootList.items)) {
    throw new PreconditionFailed(`Only empty projects can be deleted`)
  }
}

exports.list = async function ({ user, qs = {} }) {
  const [
    projects,
    isAdmin
  ] = await Promise.all([
    garden.projects.get(),
    authorization.isAdmin(user)
  ])

  const isMemberOf = project => _
    .chain(project)
    .get('spec.members')
    .findIndex({
      kind: 'User',
      name: user.id
    })
    .gte(0)
    .value()

  const phases = _
    .chain(qs)
    .get('phase', 'Ready')
    .split(',')
    .compact()
    .value()
  return _
    .chain(projects)
    .get('items')
    .filter(project => {
      if (!isAdmin && !isMemberOf(project)) {
        return false
      }
      if (!_.isEmpty(phases)) {
        const phase = _.get(project, 'status.phase', 'Initial')
        return _.includes(phases, phase)
      }
      return true
    })
    .map(fromResource)
    .value()
}

function isProjectReady ({ status: { phase } = {} } = {}) {
  return phase === 'Ready'
}

exports.create = async function ({ user, body }) {
  const name = _.get(body, 'metadata.name')
  _.set(body, 'metadata.namespace', `garden-${name}`)
  _.set(body, 'data.createdBy', user.id)
  const projects = Garden(user).projects
  let project = await projects.post({ body: toResource(body) })

  const watch = exports.watchProject(name)
  const conditionFunction = isProjectReady
  const resourceName = name
  const waitTimeout = exports.projectInitializationTimeout
  project = await kubernetes.waitUntilResourceHasCondition({ watch, conditionFunction, waitTimeout, resourceName })

  return fromResource(project)
}
// needs to be exported for testing
exports.watchProject = name => garden.projects.watch({ name })
exports.projectInitializationTimeout = PROJECT_INITIALIZATION_TIMEOUT

exports.read = async function ({ user, name: namespace }) {
  const projects = Garden(user).projects
  const namespaces = Core(user).namespaces

  const project = await getProjectByNamespace(projects, namespaces, namespace)
  return fromResource(project)
}

exports.patch = async function ({ user, name: namespace, body }) {
  const projects = Garden(user).projects
  const namespaces = Core(user).namespaces

  const project = await getProjectByNamespace(projects, namespaces, namespace)
  const name = project.metadata.name
  // do not update createdBy
  const { metadata, data } = fromResource(project)
  _.assign(data, _.omit(body.data, 'createdBy'))
  return fromResource(await projects.mergePatch({
    name,
    body: toResource({ metadata, data })
  }))
}

exports.remove = async function ({ user, name: namespace }) {
  await validateDeletePreconditions({ user, namespace })
  const projects = Garden(user).projects
  const namespaces = Core(user).namespaces

  const project = await getProjectByNamespace(projects, namespaces, namespace)
  const name = project.metadata.name
  const annotations = _.assign({
    'confirmation.garden.sapcloud.io/deletion': 'true'
  }, project.metadata.annotations)
  await projects.mergePatch({
    name,
    body: {
      metadata: {
        annotations
      }
    }
  })
  await projects.delete({ name })
  return fromResource(project)
}
