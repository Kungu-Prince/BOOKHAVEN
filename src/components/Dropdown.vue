<template>
  <div class="relative">
    <button class="z-10 relative flex items-center focus:outline-none select-none" @click="open = !open">
      <slot name="button"></slot>
    </button>

    <!-- to close when clicked on space around it-->
    <button class="fixed inset-0 h-full w-full cursor-default focus:outline-none" v-if="open" @click="open = false"
      tabindex="-1"></button>

    <!--dropdown menu-->
    <transition enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-750 ease-in" enter-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100" leave-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75">
      <div class="absolute shadow-lg border w-48 rounded-md py-1 px-2 text-sm mt-4 bg-surface-surface z-50 overflow-hidden"
        :class="[placement === 'right' ? 'right-0' : 'left-0', top ? 'bottom-0' : 'top-0']" v-if="open">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onBeforeUnmount, watchEffect } from 'vue';

export default {
  props: {
    placement: {
      type: String,
      default: 'right',
      validator: (value) => ['right', 'left'].indexOf(value) !== -1,
    },
    top: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const open = ref(false);

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        open.value = false;
      }
    };

    document.addEventListener('keydown', onEscape);

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onEscape);
    });

    // Watch for the 'open' property changes.
    watchEffect(() => {
      // Do something when 'open' changes.
    });

    return {
      open,
    };
  },
};
</script>

