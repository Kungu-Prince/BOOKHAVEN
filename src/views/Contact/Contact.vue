<template>
  <main>
    <NavSection />
    <!-- content section -->
    <section class="flex items-center gap-4 md:mt-5">
      <div class="py-3 px-6 sm:px-7 md:px-10 md:w-1/2">
        <h1 class="text-surface-on_surface text-headline-medium font-Abril_Fatface pb-4">
          Contact
        </h1>
        <p>
          Feel free to reach out and let's start a conversation. Whether you
          have questions about our books, want to discuss a
          selling your books, or simply want to connect, we are here to listen and
          collaborate. Your thoughts and inquiries are important to us, and we are
          excited to hear from you. Please use the contact form below or the
          provided contact information to get in touch. Let's bring your ideas
          to life through the power we all know exists in words.
        </p>
      </div>
      <div class="max-md:absolute max-md:opacity-10 overflow-clip max-md:w-screen md:w-1/2 -z-10">
        <img class="relative max-md:-right-[40%] md:w-7/12 max-w-[400px] rounded-md"
          src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="camera lens" loading="lazy" />
      </div>
    </section>
    <!-- Contact section -->
    <section class="flex max-md:flex-col-reverse gap-3 max-md:px-2 my-7 md:my-12">
      <div
        class="flex md:flex-col justify-evenly items-center md:justify-center w-full md:w-1/12 md:gap-5 md:min-h-full md:py-6">
        <a href="https://twitter.com/KunguPrince"><svg class="w-7 text-black" fill="currentColor" viewBox="0 0 24 24"
            aria-hidden="true">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
            </path>
          </svg></a>
        <a href="https://tiktok.com/i.am_kungu"><svg class="w-7 text-black" fill="currentColor" viewBox="0 0 24 24"
            aria-hidden="true">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
            </path>
          </svg></a>
      </div>
      <div class="w-full md:w-5/12 bg-surface-surface_variant px-3 md:px-6 py-5 md:py-7 rounded-md">
        <form @submit.prevent="submitForm" class="flex flex-col gap-3">
          <h1 class="font-Abril_Fatface text-surface-on_surface_variant text-headline-small md:text-headline-medium">
            Send a message
          </h1>
          <input v-model="name" type="text" name="name" placeholder="Your Name*" class="input" required />
          <input v-model="email" type="email" name="email" placeholder="Your Email*" class="input" required />
          <input v-model="phone" type="text" name="number" placeholder="Phone Number" class="input" />
          <textarea v-model="message" name="message" placeholder="message" class="h-32 input" required></textarea>
          <button type="submit" class="button w-full bg-primary-primary text-primary-on_primary py-2 text-body-large">
            send message
          </button>
        </form>
      </div>
      <div class="w-full md:w-6/12 px-7 flex flex-col justify-center">
        <h2 class="text-surface-on_surface text-headline-small font-Abril_Fatface pb-3">
          Details
        </h2>
        <p class="text-outline pb-1">Phone</p>
        <a class="pb-2" href="tel:+0748300213">0748300213</a>
        <p class="text-outline pb-1">Email</p>
        <a class="pb-2" href="mailto:princekungu8@gmail.com">princekungu8@gmail.com</a>
      </div>
    </section>
    <FooterSection/>
  </main>
</template>

<script>
import { ref } from "vue";
import { sendMessage } from "@/assets/js/firebase";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import NavSection from "@/components/NavSection.vue";
import FooterSection from '@/components/FooterSection.vue';

export default {
  components: { NavSection, FooterSection },
  setup() {
    const name = ref("");
    const email = ref("");
    const phone = ref("");
    const message = ref("");

    const submitForm = async (event) => {
      if (email.value && name.value && message.value) {
        const result = await sendMessage(
          name.value,
          email.value,
          phone.value,
          message.value
        );
        if (result.success === true) {
          name.value = "";
          email.value = "";
          phone.value = "";
          message.value = "";
          toast.success(
            "Message sent successfully! \nI will get to you as soon as possible"
          );
        } else {
          toast.error(`Message sending failed: ${result.error}`);
        }
      }
    };
    return {
      name,
      email,
      phone,
      message,
      submitForm,
    };
  },
};
</script>
