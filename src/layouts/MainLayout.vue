<script setup lang="ts">
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title>
            Quasar With Firebase App
          </q-toolbar-title>

          <div>Quasar v{{ $q.version }}</div>
        </q-toolbar>
      </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
