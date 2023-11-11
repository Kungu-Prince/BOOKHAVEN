<template>
  <router-view></router-view>
</template>

<script>
import { onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { auth, onAuthStateChanged } from "@/assets/js/firebase";

export default {
  setup() {

    onMounted(async () => {
      const authStore = useAuthStore();
      // Update state when user auth state changes
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Get the user's custom claim 'role' or default to 'user'
          const idTokenResult = await user.getIdTokenResult(true);
          const role = idTokenResult.claims && idTokenResult.claims.role ? idTokenResult.claims.role : 'user';
          user.role = role;
          authStore.setUser(user);
        } else {
          authStore.setUser(null);
        }
      });
    });
  },
};
</script>

<style>
</style>
