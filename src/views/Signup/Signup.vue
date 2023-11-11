import { RouterLink } from 'vue-router'; import { RouterLink } from
'vue-router';
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
          Unlock New Possibilities
        </h1>
        <p class="mr-11 text-body-large">
          Unlock the infinite possibilities at Book Haven. Create your account
          to exclusively access books, learn what others think of our books before buying them, and insightful
          metrics. Your visual story reading journey starts here.
        </p>
      </div>
      <div class="w-full md:w-1/2 flex items-end max-md:justify-center">
        <div
          class="flex flex-col items-center w-full max-w-sm md:w-5/6 md:max-w-sm bg-white h-[90%] md:h-5/6 rounded-t-xl px-3 py-4 sm:px-5 sm:py-6 overflow-y-scroll overflow-x-clip">
          <h6 class="text-label-small sm:text-label-medium text-outline w-full">
            LET'S GET YOU STARTED
          </h6>
          <h1 class="text-title-large sm:text-headline-small font-medium pb-4 w-full">
            Create an Account
          </h1>
          <form @submit.prevent="submitForm" class="flex flex-col gap-3 w-full">
            <input v-model="name" type="text" name="name"
              class="outline-none rounded-md py-3 px-2 w-full bg-white shadow placeholder-gray-400 focus:outline-none focus:shadow-outline border focus:ring-primary-primary"
              placeholder="Your Name" required />
            <input v-model="email" type="email" name="email"
              class="outline-none rounded-md py-3 px-2 w-full bg-white shadow placeholder-gray-400 focus:outline-none focus:shadow-outline border focus:ring-primary-primary"
              placeholder="Email" required />
            <div class="relative w-full flex flex-wrap items-stretch">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" name="password"
                class="relative outline-none rounded-md py-3 pr-9 px-2 w-full bg-white shadow placeholder-gray-400 focus:outline-none focus:shadow-outline border focus:ring-primary-primary"
                placeholder="Password" autocomplete="true" required />
              <span @click="togglePassword"
                class="password-toggle absolute right-0 z-10 py-1 pr-2 h-full flex items-center justify-center cursor-pointer">
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
          <img @click="googleSignIn"
            class="cursor-pointer w-32 xs:w-44 md:w-48 rounded-lg mb-auto" src="@/assets/images/google_signin.png"
            alt="Sign in with google" />
            <img @click="facebookSignIn"
            class="cursor-pointer w-32 xs:w-44 md:w-48 rounded-lg mb-auto" src="https://i.stack.imgur.com/oL5c2.png"
            alt="Sign in with facebook" />
          <p class="text-label-small md:text-label-medium">
            Already have an account?
            <RouterLink to="/Login" class="text-primary-primary">LOGIN HERE</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref } from "vue";
import { newAccountWithEP, signInWithGoogle, signInWithFacebook } from "@/assets/js/firebase";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const showPassword = ref(false);
    const backgroundImageUrl = require("@/assets/images/mohamed-nohassi-9o6b6vrLdGc-unsplash.jpg");

    const submitForm = async () => {
      if (name.value && email.value && password.value) {
        const result = await newAccountWithEP(
          name.value,
          email.value,
          password.value
        );
        if (result === true) {
          name.value = "";
          email.value = "";
          password.value = "";
          toast.success("Account created successfully");
          setTimeout(() => {
            router.push("/gallery");
          }, 3000);
        } else {
          toast.error(`Account creation failed: ${result.error}`);
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

    const facebookSignIn = async () => {
      const result = await signInWithFacebook();
      if (result.success === true) {
        toast.success("Facebook sign in successful");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error(`Facebook sign in failed: ${result.error}`);
      }
    };

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      name,
      email,
      password,
      submitForm,
      googleSignIn,
      showPassword,
      togglePassword,
      facebookSignIn,
      backgroundImageUrl,
    };
  },
};
</script>
