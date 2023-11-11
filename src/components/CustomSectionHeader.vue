<script setup>
const props = defineProps({
  heading: String,
  title: String,
});
</script>

<template>
  <header>
    <!-- Heading and title section -->
    <div>
      <div v-if="heading" class="flex items-center gap-3 mb-3 font-medium">
        <h2 class=" text-surface-on_surface_variant text-label-large">{{ heading }}</h2>
        <hr
          class="flex-1 max-w-[5rem] border-[1.5px] border-outline rounded-full opacity-75"
        />
      </div>
      <div v-if="title" class=" text-headline-large sm:text-display-small text-surface-on_surface font-bold font-Abril_Fatface">
        {{ title }}
      </div>
    </div>

    <slot></slot>
  </header>
</template>
