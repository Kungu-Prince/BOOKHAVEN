<template>
  <!--Nav-->
  <NavSection />

  <CustomSection>
    <CustomSectionHeader title="Products" />
    <form @submit.prevent="() => { lastDoc = null; loadBooks() }" class="flex gap-3 justify-end">
      <input v-model="category" type="text" name="category" placeholder="Filter by category"
        class="input w-full md:w-3/12" required />
      <CustomButton>Search </CustomButton>
    </form>
    <div class=" my-5 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 w-full">

      <div class="group" v-for="n of Array(4)" v-if="state === 'loading'">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <div class="h-full w-full skeleton aspect-[2/3]"></div>
        </div>
        <h3 class="mt-4 skeleton w-[70%] h-5 rounded-md"></h3>
        <h3 class="mt-1 skeleton w-[30%] h-5 rounded-md"></h3>
      </div>

      <div to="" class="group" v-for="(book, index) in books" :key="index" v-if="state === 'done' && books.length > 0">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <RouterLink :to="`book/${book.id}`"><img :src="book.image" alt="Cover Image"
              class="h-full w-full object-cover object-center group-hover:opacity-75 hover:scale-105 aspect-[2/3]">
          </RouterLink>

        </div>
        <h4 class=" text-label-medium text-tertiary-tertiary py-3">{{ book.category }}</h4>
        <h3 class=" text-title-medium text-surface-on_surface">{{ book.title }}</h3>
        <p class="mt-1 text-body-medium font-medium text-surface-on_surface_variant">KSH {{ book.price.toLocaleString() }}
        </p>
        <div class="w-full flex justify-between items-center">
          <div v-if="book && book.rating">
            <star-rating :rating="averageRating({ ...book.rating })" :read-only="true" active-color="#FFD700"
              text-class="hidden" star-size="20" />
          </div>
          <i class='bx bx-cart text-2xl text-secondary-secondary hover:scale-105 cursor-pointer'
            @click="callAddToCart(book, 1)"></i>
        </div>
      </div>

    </div>
    <div class="w-full flex justify-center" v-if="state === 'done' && books.length == 0">
      <p class=" text-label-large my-4 text-center text-outline">No books at the moment</p>
    </div>

  </CustomSection>
  <FooterSection />
</template>

<script setup>
import NavSection from '@/components/NavSection.vue';
import CustomButton from '@/components/CustomButton.vue'
import { onMounted, ref } from 'vue';
import { getBooks, addToCart } from '@/assets/js/firebase';
import CustomSection from '@/components/CustomSection.vue'
import CustomSectionHeader from '@/components/CustomSectionHeader.vue'
import StarRating from 'vue-star-rating';
import { averageRating } from '@/assets/js/functions.js';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import FooterSection from '@/components/FooterSection.vue';


const books = ref([]);
const state = ref('loading');
const lastDoc = ref(null);
const category = ref(null);

const loadBooks = async () => {
  state.value = 'loading'
  const response = await getBooks(40, lastDoc.value, category.value ? category.value : null);
  lastDoc.value = response.lastDoc;
  books.value = [...response.books];
  state.value = 'done'
}

const callAddToCart = async (product, amount) => {
  const response = await addToCart(product, amount);
  if (response.success) {
    toast.success("Item added to cart.");
  } else {
    toast.error(`Error adding item to cart: ${response.error}`);
  }
}

onMounted(() => {
  loadBooks();
});


</script>

<style lang="scss" scoped></style>