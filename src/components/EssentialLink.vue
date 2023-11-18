<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}
withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

const router = useRoute();

const active = ref<boolean>(false);
const getColor = (data: string) => {
  if (data) {
    active.value = false;
  } else {
    active.value = true;
  }
};

</script>

<template>
  <q-item
    clickable
    :to="link"
    class="text-secondary text-bold"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label  >
        {{ title }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped>
.q-list > .q-router-link--exact-active {
  color: var(--q-primary) !important;
}
</style>
