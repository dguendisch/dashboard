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

module.exports = {
  Namespace: {
    name: 'namespaces',
    kind: 'Namespace',
    apiVersion: 'v1'
  },
  Secret: {
    name: 'secrets',
    kind: 'Secret',
    apiVersion: 'v1'
  },
  Endpoint: {
    name: 'endpoints',
    kind: 'Endpoints',
    apiVersion: 'v1'
  },
  Service: {
    name: 'services',
    kind: 'Service',
    apiVersion: 'v1'
  },
  APIService: {
    name: 'apiservices',
    kind: 'APIService',
    apiVersion: 'apiregistration.k8s.io/v1'
  },
  SelfSubjectAccessReview: {
    name: 'selfsubjectaccessreviews',
    kind: 'SelfSubjectAccessReview',
    apiVersion: 'authorization.k8s.io/v1'
  },
  TokenReview: {
    name: 'tokenreviews',
    kind: 'TokenReview',
    apiVersion: 'authentication.k8s.io/v1'
  },
  RoleBinding: {
    name: 'rolebindings',
    kind: 'RoleBinding',
    apiVersion: 'rbac.authorization.k8s.io/v1'
  },
  ClusterRoleBinding: {
    name: 'clusterrolebindings',
    kind: 'ClusterRoleBinding',
    apiVersion: 'rbac.authorization.k8s.io/v1'
  },
  ClusterRole: {
    name: 'clusterroles',
    kind: 'ClusterRole',
    apiVersion: 'rbac.authorization.k8s.io/v1'
  },
  ServiceAccount: {
    name: 'serviceaccounts',
    kind: 'ServiceAccount',
    apiVersion: 'v1'
  },
  Ingress: {
    name: 'ingresses',
    kind: 'Ingress',
    apiVersion: 'extensions/v1beta1'
  },
  Shoot: {
    name: 'shoots',
    kind: 'Shoot',
    apiVersion: 'core.gardener.cloud/v1alpha1'
  },
  Seed: {
    name: 'seeds',
    kind: 'Seed',
    apiVersion: 'core.gardener.cloud/v1alpha1'
  },
  CloudProfile: {
    name: 'cloudprofiles',
    kind: 'CloudProfile',
    apiVersion: 'core.gardener.cloud/v1alpha1'
  },
  SecretBinding: {
    name: 'secretbindings',
    kind: 'SecretBinding',
    apiVersion: 'core.gardener.cloud/v1alpha1'
  },
  Quota: {
    name: 'quotas',
    kind: 'Quota',
    apiVersion: 'core.gardener.cloud/v1alpha1'
  },
  Project: {
    name: 'projects',
    kind: 'Project',
    apiVersion: 'core.gardener.cloud/v1alpha1'
  },
  Terminal: {
    name: 'terminals',
    kind: 'Terminal',
    apiVersion: 'dashboard.gardener.cloud/v1alpha1'
  }
}
