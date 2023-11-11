<template>
  <div class="relative">
    <button class="focus:outline-none select-none w-full max-h-fit" @click="open = !open">
      <slot name="button"></slot>
    </button>

    <button class="fixed inset-0 h-full w-full cursor-default focus:outline-none bg-black bg-opacity-75 z-[100]"
      v-if="open" @click="open = false" tabindex="-1"></button>
    <transition enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-750 ease-in" enter-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100" leave-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75">
      <div
        class="fixed inset-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg border !max-w-[94%] md:!max-w-[60%] lg:!max-w-[60%] w-fit max-h-[90%] md:max-h-[80%] lg:max-h-[70%] h-fit rounded-md py-3 px-4 bg-surface-surface text-surface-on_surface_variant z-[110] overflow-y-scroll"
        v-if="open">
        <slot name="content"></slot>
      </div>

    </transition>
  </div>
</template>

<script >
import { onBeforeUnmount, ref } from 'vue';

export default {
  props: {
    top: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {

    const open = ref(props.open);

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        open.value = false;
      }
    };

    document.addEventListener('keydown', onEscape);

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onEscape);
    });

    return { open }
  }
}

</script>

<style lang="scss" scoped></style>
