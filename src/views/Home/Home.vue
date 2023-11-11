<template>
  <!--Nav-->
  <NavSection />

  <!--Hero-->
  <div class="w-full px-auto flex flex-col md:flex-row items-center py-12 md:py-24 bg-cover text-surface-surface"
    :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)` }">
    <!--Left Col-->
    <div class="flex flex-col w-full lg:w-1/2 justify-center items-start pt-12 pb-24 px-6">
      <p class="uppercase tracking-loose">Unlock Worlds, One Page at a Time!</p>
      <h1 class="font-bold text-3xl my-4">BOOK HAVEN</h1>
      <p class="leading-normal mb-4 bg-surface-on_surface_variant p-2 rounded-md">Your premier destination for immersive storytelling. Explore a world of novels where every page holds an adventure.</p>
      <RouterLink to="/products"><CustomButton>Products</CustomButton></RouterLink>   
    </div>
    <!--Right Col-->
    <div class="w-full lg:w-1/2 lg:py-6 text-center">
      <!--Add your product image here-->
      <svg class="fill-current text-gray-900 w-3/5 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M17 6V5h-2V2H3v14h5v4h3.25H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6zm-5.75 14H3a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5.75zM11 8v8h6V8h-6zm3 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
    </div>
  </div>
  <CustomSection>
    <CustomSectionHeader title="Products" />
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
            class="h-full w-full object-cover object-center group-hover:opacity-75 hover:scale-105 aspect-[2/3]"></RouterLink>

        </div>
        <h4 class=" text-label-medium text-tertiary-tertiary py-3">{{ book.category }}</h4>
        <h3 class=" text-title-medium text-surface-on_surface">{{ book.title }}</h3>
        <p class="mt-1 text-body-medium font-medium text-surface-on_surface_variant">KSH {{ book.price.toLocaleString() }}
        </p>
        <div class="w-full flex justify-between items-center">
          <star-rating v-if="book.rating" :rating="averageRating({...book.rating})" :read-only="true" active-color="#FFD700" text-class="hidden"
            star-size="20" />
          <i class='bx bx-cart text-2xl text-secondary-secondary hover:scale-105 cursor-pointer'
            @click="callAddToCart(book, 1)"></i>
        </div>
      </div>

    </div>
    <div class="w-full flex justify-end" v-if="state === 'done' && books.length >= 8">
      <RouterLink to="/products"><CustomButton>Veiw more</CustomButton></RouterLink>
    </div>
    <div class="w-full flex justify-center" v-if="state === 'done' && books.length == 0">
      <p class=" text-label-large my-4 text-center text-outline">No books at the moment</p>
    </div>

  </CustomSection>
  <FooterSection/>
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

const loadBooks = async () => {
  state.value = 'loading'
  const response = await getBooks(8, lastDoc.value);
  lastDoc.value = response.lastDoc;
  books.value = [...books.value, ...response.books];
  state.value = 'done'
  console.log(books.value[0].rating.target);
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