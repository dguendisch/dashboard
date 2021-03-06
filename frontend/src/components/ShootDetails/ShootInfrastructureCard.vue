<!--
Copyright (c) 2019 by SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the LICENSE file

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
  <v-card>
    <v-card-title class="subheading white--text cyan darken-2 cardTitle">
      Infrastructure
    </v-card-title>
    <div class="list">

      <v-card-title class="listItem">
        <v-layout class="py-2">
          <v-flex shrink justify-center class="pr-0 pt-3">
            <v-icon class="cyan--text text--darken-2 avatar">cloud_queue</v-icon>
          </v-flex>
          <v-flex class="pa-0">
            <v-layout row>
              <v-flex>
                <span class="grey--text">Provider</span><br>
                <span class="subheading">{{shootCloudProviderKind}}</span>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <span class="grey--text">Credential</span><br>
                <router-link slot="activator" class="cyan--text text--darken-2" :to="{ name: 'Secret', params: { name: shootSecretName, namespace } }">
                  <span class="subheading">{{shootSecretName}}</span>
                </router-link>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <span class="grey--text">{{regionZoneTitle}}</span><br>
                <span class="subheading">{{regionZoneText}}</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>

      <template v-if="showSeedInfo">
        <v-divider class="my-2" inset></v-divider>
        <v-card-title class="listItem">
          <v-layout class="py-2">
            <v-flex shrink justify-center class="pr-0 pt-3">
              <v-icon class="cyan--text text--darken-2 avatar">spa</v-icon>
            </v-flex>
            <v-flex class="pa-0">
              <span class="grey--text">Seed</span><br>
              <router-link v-if="canLinkToSeed" class="cyan--text text--darken-2 subheading" :to="{ name: 'ShootItem', params: { name: shootSeedName, namespace:'garden' } }">
                <span class="subheading">{{shootSeedName}}</span><br>
              </router-link>
              <template v-else>
                <span class="subheading">{{shootSeedName}}</span><br>
              </template>
              <v-layout row>
                <v-flex>
                  <span class="grey--text">Technical Id</span><br>
                  <span class="subheading">{{shootTechnicalId}}</span>
                </v-flex>
                <copy-btn :clipboard-text="shootTechnicalId"></copy-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-title>
      </template>

      <v-divider class="my-2" inset></v-divider>
      <v-card-title class="listItem">
        <v-icon class="cyan--text text--darken-2 avatar">settings_ethernet</v-icon>
        <v-flex class="pa-0">
          <span class="grey--text">CIDR</span><br>
          <span class="subheading">{{shootCidr}}</span>
        </v-flex>
      </v-card-title>

      <template v-if="!!shootIngressDomainText">
        <v-divider class="my-2" inset></v-divider>
        <v-card-title class="listItem">
          <v-icon class="cyan--text text--darken-2 avatar">mdi-earth</v-icon>
          <v-flex class="pa-0">
            <span class="grey--text">Ingress Domain</span><br>
            <span class="subheading">{{shootIngressDomainText}}</span>
          </v-flex>
        </v-card-title>
      </template>

    </div>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex'
import get from 'lodash/get'
import join from 'lodash/join'
import includes from 'lodash/includes'
import CopyBtn from '@/components/CopyBtn'
import {
  canLinkToSeed
} from '@/utils'
import { shootItem } from '@/mixins/shootItem'

export default {
  components: {
    CopyBtn
  },
  props: {
    shootItem: {
      type: Object
    }
  },
  mixins: [shootItem],
  computed: {
    ...mapGetters([
      'namespaces'
    ]),
    showSeedInfo () {
      return !!this.shootSeedName && this.hasAccessToGardenNamespace
    },
    hasAccessToGardenNamespace () {
      return includes(this.namespaces, 'garden')
    },
    canLinkToSeed () {
      return canLinkToSeed({ namespace: this.namespace, seedName: this.shootSeedName })
    },
    shootIngressDomainText () {
      const nginxIngressEnabled = get(this.shootItem, 'spec.addons.nginx-ingress.enabled', false)
      if (!this.shootDomain || !nginxIngressEnabled) {
        return undefined
      }
      return `*.ingress.${this.shootDomain}`
    },
    namespace () {
      return get(this.$route.params, 'namespace')
    },
    shootZonesText () {
      return join(this.shootZones, ', ')
    },
    regionZoneText () {
      if (this.shootZones.length > 0) {
        return `${this.shootRegion} / ${this.shootZonesText}`
      }
      return this.shootRegion
    },
    regionZoneTitle () {
      if (this.shootZones.length > 0) {
        return `Region / ${this.zoneTitle}`
      }
      return 'Region'
    },
    zoneTitle () {
      if (this.shootZones.length > 1) {
        return 'Zones'
      }
      return 'Zone'
    },
    shootSecretName () {
      return this.shootSecretBindingName || 'default'
    }
  }
}
</script>

<style lang="styl" scoped>

  .cardTitle {
    line-height: 10px;
  }

  .listItem {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .list {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .avatar {
    padding-right: 33px;
  }

</style>
