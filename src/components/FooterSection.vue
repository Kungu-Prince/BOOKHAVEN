<template>
  <!-- Footer -->
  <footer class=" bg-surface-surface_variant text-surface-on_surface_variant w-screen flex justify-center items-center p-6">
    <div class="flex flex-col gap-4 items-center">
      <div class="flex max-md:flex-col gap-3 md:gap-10 lg:gap-12 md:justify-center">
        <div class="flex justify-center">
          <RouterLink to="/"><img class="w-20" src="@/assets/images/logo.png" alt="logo" loading="lazy" /></RouterLink>
        </div>
        <div class="flex max-md:flex-col gap-3 md:gap-9 lg:gap-11">
          <div>
            <h3 class="text-surface-on_surface font-medium text-label-medium">
              Quick Links
            </h3>
            <div class="text-label-small flex max-md:flex-wrap md:flex-col gap-2 md:gap-1 py-1 md:pt-2">
              <RouterLink to="/">Portfolio</RouterLink>
              <RouterLink to="/Services">Services</RouterLink>
              <RouterLink to="/Gallery">Gallery</RouterLink>
              <RouterLink to="/Contact">Contact</RouterLink>
              <RouterLink to="/Login">Login</RouterLink>
              <RouterLink to="/Dashboard/main">Dashboard</RouterLink>
              <RouterLink to="/Legals">Legals</RouterLink>
            </div>
          </div>
          <div class="flex flex-col gap-2 text-label-small">
            <h3 class="text-surface-on_surface font-medium text-label-medium mb:pb-1">
              contact
            </h3>
            <p>
              Phone :
              <a class="font-medium" href="tel:+254748300213">+254748300213</a>
            </p>
            <p>
              Email :
              <a class="font-medium" href="mailto:princekungu8@gmail.com">princekungu8@gmail.com</a>
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <h3 class="text-surface-on_surface font-medium text-label-medium mb:pb-1">
              Social
            </h3>
            <div class="flex gap-1 items-center">
              <a href="https://twitter.com/KunguPrince"><svg class="w-5 lg:w-6 text-black" fill="currentColor"
                  viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
                  </path>
                </svg></a>
              <a href="https://tiktok.com/i.am_kungu"><svg class="w-5 lg:w-6 text-black" fill="currentColor"
                  viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
                  </path>
                </svg></a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full flex max-md:flex-col justify-between text-center items-center gap-2 border-t text-outline text-label-small p-3">
        <p>
          Designed and Develped by
          <a class="text-tertiary-tertiary underline" href="https://github.com/Kungu-Prince">Bookish</a>
        </p>
        <p class="copywrite">
          ©<span>{{ currentYear }}</span> Prince
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from "vue";
import { subscribe } from "@/assets/js/firebase";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const currentYear = ref(new Date().getFullYear());


    return { currentYear };
  },
};
</script>
