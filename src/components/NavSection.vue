<template>
  <!-- Navigation bar -->
  <nav class="flex flex-wrap items-center justify-between w-full py-1 sticky top-0 md:py-2 bg-white border-b z-30">
    <div>
      <RouterLink to="/" class="flex gap-1 items-center"><img class="mx-2 h-6 sm:h-7 md:h-8 lg:h-9"
          src="@/assets/images/logo.png" alt="Logo" />
        <h2 class="max-md:hidden text-title-large font-Abril_Fatface">BOOKHAVEN</h2>
      </RouterLink>
    </div>
    <i @click="toggleNav" class="bx bx-menu-alt-right text-2xl cursor-pointer md:hidden block px-2"></i>
    <div class="md:flex md:items-center md:w-auto max-md:bg-white w-full max-md:shadow-lg md:px-3"
      :class="{ 'hide': isNavHidden }" id="nav">
      <ul class="md:flex md:justify-between md:pt-0 gap-4 max-md:mx-5">
        <li>
          <RouterLink class="py-2 md:py-3 block hover:text-primary-primary"
            :class="{ 'text-primary-primary': $route.path === '/' }" to="/">
            Home
          </RouterLink>
        </li>
        <li>
          <RouterLink class="py-2 md:py-3 block hover:text-primary-primary"
            :class="{ 'text-primary-primary': $route.path.startsWith('/products') }" to="/products">
            Products
          </RouterLink>
        </li>
        <li>
          <RouterLink class="py-2 md:py-3 block hover:text-primary-primary"
            :class="{ 'text-primary-primary': $route.path.startsWith('/contact') }" to="/contact">
            Contact
          </RouterLink>
        </li>
        <li v-if="authStore.user" class=" block">
          <Dropdown placement="right">
            <template v-slot:button>
              <div class="flex gap-2 items-center max-md:my-2">
                <img v-if="authStore.user && authStore.user.photoURL" :src="authStore.user.photoURL" alt="avatar"
                  class="rounded-full h-8 md:h-10">
                <i v-else class='bx bxs-user-circle text-4xl'></i>
                <div v-if="authStore.user" class="md:hidden">
                  <p class="text-label-large text-ellipsis">{{ authStore.user.displayName }}</p>
                </div>
              </div>
            </template>
            <template v-slot:content>
              <RouterLink
                class="flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-primary-primary_container hover:text-primary-on_primary_container"
                to="/user">Profile</RouterLink>
              <RouterLink
                class="flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-primary-primary_container hover:text-primary-on_primary_container"
                to="/new">Sell Books</RouterLink>
              <div class="max-md:hidden">
                <UserSettings>
                  <template v-slot:button>
                    <a
                      class="flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-primary-primary_container hover:text-primary-on_primary_container">Settings</a>
                  </template>
                </UserSettings>
              </div>
              <hr />
              <a class="cursor-pointer flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-error-error_container hover:text-error-on_error_container"
                @click="signOut">Logout</a>
            </template>
          </Dropdown>
        </li>
        <li v-else>
          <RouterLink class="py-2 md:py-3 block hover:text-primary-primary"
            :class="{ 'text-primary-primary': $route.path.startsWith('/login') }" to="/login">
            Login
          </RouterLink>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore.js';
import { signout } from '@/assets/js/firebase';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Dropdown from './Dropdown.vue';
import UserSettings from './UserSettings.vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const isNavHidden = ref(true);
    const signOut = async () => {
      const result = await signout();
      if (result.success === true) {
        toast.success("Signed out");
      }
      else {
        toast.error("Error singing out :", result.error);
      }
    };
    const toggleNav = () => {
      isNavHidden.value = !isNavHidden.value;
    };
    return {
      authStore,
      isNavHidden,
      toggleNav,
      signOut
    };
  },
  components: { Dropdown, UserSettings }
};
</script>
