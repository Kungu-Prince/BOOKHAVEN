<template>
  <main
    class="text-surface-on_surface_variant h-screen font-Poppins text-body-small lg:text-body-medium w-screen bg-cover"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="absolute -z-30 w-full h-full bg-gradient-to-tr from-neutral-800 to-neutral-700 bg-opacity-10 opacity-60">
    </div>

    <section class="flex w-full h-full gap-4">
      <div
        class="max-md:hidden w-1/2 h-full flex flex-col justify-center text-primary-on_primary ml-16 lg:ml-20 overflow-clip">
        <RouterLink to="/" class="w-3/12 mb-9 lg:mb-11"><img class="w-full h-full" src="@/assets/images/logo.png"
            alt="logo" /></RouterLink>
        <h1 class="font-Abril_Fatface text-headline-large mb-4">
          Access Your Space
        </h1>
        <p class="mr-11 text-body-large">
          Discover, Dive, and Share:
        
          Are you ready to explore an infinite world of novels? Dive into captivating stories,
          connect with fellow book lovers, and unlock a world of literary wonders. Join our community
           today to get started.
        </p>
      </div>
      <div class="w-full md:w-1/2 flex items-end max-md:justify-center">
        <div
          class="flex flex-col items-center w-full max-w-sm md:w-5/6 md:max-w-sm bg-white h-[90%] md:h-5/6 rounded-t-xl px-3 py-4 sm:px-5 sm:py-6 overflow-y-scroll overflow-x-clip">
          <h6 class="text-label-small sm:text-label-medium text-outline w-full">
            WELCOME BACK
          </h6>
          <h1 class="text-title-large sm:text-headline-small font-medium pb-4 w-full">
            Log In to your Account
          </h1>
          <form @submit.prevent="submitForm" class="flex flex-col gap-3 w-full">
            <input v-model="email" type="email" name="email"
              class="outline-none rounded-md py-3 px-2 w-full bg-white shadow placeholder-gray-400 focus:outline-none focus:shadow-outline border focus:ring-primary-primary"
              placeholder="Email" />
            <div class="relative w-full flex flex-wrap items-stretch">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" name="password"
                class="relative outline-none rounded-md py-3 pr-9 px-2 w-full bg-white shadow placeholder-gray-400 focus:outline-none focus:shadow-outline border focus:ring-primary-primary"
                placeholder="Password" autocomplete="true" />
              <span @click="togglePassword"
                class="absolute right-0 z-10 py-1 pr-2 h-full flex items-center justify-center cursor-pointer">
                <i class="bx text-xl text-outline" :class="showPassword ? 'bxs-hide' : 'bxs-show'"></i>
              </span>
            </div>
            <button type="submit"
              class="w-full bg-primary-primary text-primary-on_primary rounded-md py-3 text-body-medium">
              GET STARTED
            </button>
          </form>
          <div class="flex items-center justify-between my-4 text-surface-on_surface w-full">
            <hr class="w-[43%] bg-outline" />
            <p class="text-label-large font-medium">OR</p>
            <hr class="w-[43%] bg-outline" />
          </div>
          <img @click="googleSignIn" id="googleSignInButton"
            class="cursor-pointer w-32 xs:w-44 md:w-48 rounded-lg mb-auto" src="@/assets/images/google_signin.png"
            alt="Sign in with google" />
          <p class="text-label-small md:text-label-medium">
            New user?
            <RouterLink to="/Signup" class="text-primary-primary">SIGN UP HERE</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { signInWithEP, signInWithGoogle } from "@/assets/js/firebase";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const showPassword = ref(false);
    const backgroundImageUrl = require("@/assets/images/philip-oroni-MKapncnH4nU-unsplash.jpg");

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const submitForm = async () => {
      if (email.value && password.value) {
        const result = await signInWithEP(email.value, password.value);
        if (result.success === true) {
          email.value = "";
          password.value = "";
          toast.success("Logged in");
          setTimeout(() => {
            if (result.role === 'admin') {
              router.push("/");
            } else {
              router.push("/");
            }
          }, 3000);
        } else {
          toast.error(`Login failed: ${result.error}`);
        }
      }
    };

    const googleSignIn = async () => {
      const result = await signInWithGoogle();
      if (result.success === true) {
        toast.success("Google sign in successful");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error(`Google sign in failed: ${result.error}`);
      }
    };

    return {
      email,
      password,
      submitForm,
      googleSignIn,
      showPassword,
      togglePassword,
      backgroundImageUrl,
    };
  },
};
</script>
