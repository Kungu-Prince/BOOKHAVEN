<template>
  <div v-if="status == 'loading'" class="flex justify-center items-center w-[100dvw] h-[100dvh]">
    <p class=" text-label-large text-center text-outline">Loading...</p>
  </div>
  <div v-if="status == 'done' && book">
    <NavSection />
    <CustomSection>
      <div class=" w-full flex max-md:flex-col gap-4">
        <div class=" w-full md:w-4/12 p-1">
          <img :src="book.image" alt="Image" class="w-full aspect-[2/3] rounded-md">
        </div>
        <div class="w-full md:w-6/12 flex flex-col gap-2">
          <CustomSectionHeader heading="Book" :title="book.title" class="mb-1" />
          <h5 class=" text-secondary-secondary text-label-large">{{ book.category }}</h5>
          <h4 class=" text-title-large">Description</h4>
          <p class=" text-surface-on_surface_variant">{{ book.description }}</p>
          <star-rating v-if="book.rating" :rating="averageRating({ ...book.rating })" :read-only="true"
            active-color="#FFD700" text-class="hidden" star-size="20" />
          <p class=" font-medium" :class="book.stockLeft == 0 ? ' text-error-error' : ''">{{ book.stockLeft > 0 ?
            `${book.stockLeft} Left` : 'Out of Stock' }}</p>
          <p class=" text-body-large font-semibold">KSH {{ book.price.toLocaleString() }}</p>
          <div class="flex gap-2 p-3">
            <div class="px-2 py-1 bg-primary-primary text-primary-on_primary cursor-pointer hover:scale-105 rounded-md"
              :class="quantity == 0 ? '!cursor-default hover:!scale-100 bg-primary-primary_container' : ''"
              @click="() => { if (quantity != 0) callAddToCart(quantity - 1) }"> - </div>
            <p>{{ quantity }}</p>
            <div class="px-2 py-1 bg-primary-primary text-primary-on_primary cursor-pointer hover:scale-105 rounded-md"
              :class="quantity == book.stockLeft ? '!cursor-default hover:!scale-100 bg-primary-primary_container' : ''"
              @click="() => { if (quantity != book.stockLeft) callAddToCart(quantity + 1) }"> +
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2 flex-col my-3">
        <h3 class=" text-title-large font-Abril_Fatface">Reviews</h3>
        <div v-if="book.reviews.length > 0" v-for="(review, index) in book.reviews" :key="index"
          class="bg-white p-3 rounded-md shadow-sm flex flex-col gap-1 border border-outline border-opacity-50">
          <h3 class=" text-title-medium">{{ review.userName }}</h3>
          <star-rating v-if="review.rating" :rating="review.rating" :read-only="true" active-color="#FFD700"
            text-class="hidden" star-size="15" />
          <p class=" text-surface-on_surface_variant">{{ review.review }}</p>
          <p>{{ formatFirebaseTimestamp(review.date) }}</p>
        </div>
        <p v-else class=" text-label-large text-center text-outline">No reviews</p>
      </div>
    </CustomSection>
    <FooterSection/>
  </div>
  <div v-if="status == 'done' && !book" class="flex justify-center items-center w-[100dvw] h-[100dvh]">
    <p class=" text-label-large text-center text-outline">Book not found...</p>
  </div>
</template>

<script setup>
import { getBook, getBookFromCart, addToCart } from '@/assets/js/firebase';
import CustomSection from '@/components/CustomSection.vue'
import CustomSectionHeader from '@/components/CustomSectionHeader.vue'
import StarRating from 'vue-star-rating';
import { averageRating, formatFirebaseTimestamp } from '@/assets/js/functions.js';
import { useAuthStore } from '@/store/authStore.js';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import NavSection from '@/components/NavSection.vue';
import FooterSection from '@/components/FooterSection.vue';

// const props = defineProps({
//   book: {
//     type: Object,
//   }
// });

const route = useRoute();
const book = ref(null);
const status = ref('loading');
const authStore = useAuthStore();
const isInCart = ref(false);
const quantity = ref(0);

const callGetBook = async (id) => {
  status.value = 'loading';
  const response = await getBook(id);
  if (response.success == true) {
    book.value = response.book;
    if (authStore.user) {
      const response = await getBookFromCart(id);
      if (response.success == true && response.isInCart == true) {
        isInCart.value = true;
        quantity.value = response.quantity;
      } else if (response.success == true && response.isInCart == false) {
        isInCart.value = false;
        quantity.value = 0;
      } else {
        toast.error(`Something went wrong: ${response.error}`)
      }
    }
  } else {
    toast.error(`Error getting book: ${response.error}`);
  }

  status.value = 'done';
}

const callAddToCart = async (amount) => {
  if (authStore.user) {
    const response = await addToCart(book.value, amount);
    if (response.success == true) {
      quantity.value = amount;
    } else {
      toast.error(`Error modifying cart: ${response.error}`)
    }
  } else {
    toast.error('Login to add item to cart');
  }
}

onMounted(() => {
  callGetBook(route.params.id);
})
</script>

<style lang="scss" scoped></style>