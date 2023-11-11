<template>
  <NavSection />
  <div v-if="authStore.user">
    <CustomSection>
      <CustomSectionHeader title="User Profile" />
      <div class=" flex gap-3 max-md:flex-col my-3">
        <div class="rounded-full overflow-clip my-1 w-40">
          <img v-if="authStore.user.photoURL" :src="authStore.user.photoURL" alt="image" class="w-40">
          <i v-else class='bx bxs-user-circle text-[160px] text-outline'></i>
        </div>
        <div class="flex flex-col gap-2 mx-2 md:mx-7">
          <p class=" text-body-large"><strong>Name : </strong>{{ authStore.user.displayName }}</p>
          <p class=" text-body-large"><strong>Email : </strong>{{ authStore.user.email }}</p>
          <CheckoutModal v-if="cart.length > 0" :cart="cart">
            <template v-slot:button>
              <CustomButton class="w-fit">Checkout</CustomButton>
            </template>
          </CheckoutModal>
        </div>
      </div>
    </CustomSection>
    <CustomSection>
      <CustomSectionHeader title="Cart" class="mb-4" />
      <div class="flex flex-col gap-4">
        <div v-if="cart.length > 0" v-for="(item, index) in cart" :key="index"
          class="bg-white rounded-md shadow-sm flex gap-1 border border-outline border-opacity-50">
          <img :src="item.image" class=" rounded-l-md w-36 aspect[2/3]">
          <div class="p-3">
            <h3 class=" text-title-large">{{ item.title }}</h3>
            <p class=" text-body-large font-semibold">KSH {{ item.price.toLocaleString() }}</p>
            <div class="flex gap-2 p-3">
              <div class="px-2 py-1 bg-primary-primary text-primary-on_primary cursor-pointer hover:scale-105 rounded-md"
                :class="item.quantity == 0 ? '!cursor-default hover:!scale-100 bg-primary-primary_container' : ''"
                @click="callAddToCart(item.id, item.quantity - 1)"> - </div>
              <p>{{ item.quantity }}</p>
              <div class="px-2 py-1 bg-primary-primary text-primary-on_primary cursor-pointer hover:scale-105 rounded-md"
                @click="callAddToCart(item.id, item.quantity + 1)">+
              </div>
            </div>
            <p class=" text-body-large font-semibold">Total: KSH {{ (item.price * item.quantity).toLocaleString() }}</p>
          </div>
        </div>
        <div v-else>
          <p class=" text-label-large text-center text-outline">Cart is empty</p>
        </div>
      </div>
    </CustomSection>
    <CustomSection>
      <CustomSectionHeader title="Order History" class="mb-4" />
      <div class="flex flex-col gap-4">
        <div v-if="pastOrders.length > 0" v-for="(item, index) in pastOrders" :key="index"
          class="bg-white rounded-md shadow-sm flex gap-1 border border-outline border-opacity-50">
          <img :src="item.image" class=" rounded-l-md w-36 aspect[2/3]">
          <div class="p-3">
            <h3 class=" text-title-large">{{ item.title }}</h3>
            <p class=" "><strong>quantity: </strong>{{ item.quantity }}</p>
            <p class=" "><strong>Total: </strong>KSH {{ (item.price * item.quantity).toLocaleString() }}</p>
            <p class=" "><strong>Status: </strong>{{ item.status }}</p>
            <p class=" "><strong>Date: </strong>{{ formatFirebaseTimestamp(item.date) }}</p>
            <ReviewModal v-if="!item.reviewed" :bookId="item.productId" :bookTitle="item.title" :orderId="item.id">
              <template v-slot:button>
                <CustomButton class="my-3">Review</CustomButton>
              </template>
            </ReviewModal>
          </div>
        </div>
        <div v-else>
          <p class=" text-label-large text-center text-outline">No past orders</p>
        </div>
      </div>
    </CustomSection>
    <FooterSection />
  </div>
  <div v-else class="flex justify-center items-center w-[100dvw] h-[100dvh]">
    <p class=" text-label-large text-center text-outline">Login to view this page</p>
  </div>
</template>

<script setup>
import NavSection from '@/components/NavSection.vue';
import CustomButton from '@/components/CustomButton.vue'
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/authStore.js';
import { getCart, addToCart, getBook, getOrders } from '@/assets/js/firebase';
import CustomSection from '@/components/CustomSection.vue'
import CustomSectionHeader from '@/components/CustomSectionHeader.vue'
import { averageRating, formatFirebaseTimestamp } from '@/assets/js/functions.js';
import StarRating from 'vue-star-rating';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CheckoutModal from './CheckoutModal'
import FooterSection from '@/components/FooterSection.vue';
import ReviewModal from './ReviewModal'

const authStore = useAuthStore();
const cart = ref([]);
const pastOrders = ref([]);

const callGetCart = async () => {
  const response = await getCart();
  if (response.success == true) {
    cart.value = response.cart
  } else {
    toast.error(`Error showing cart: ${response.error}`)
  }
}
const callGetOrders = async () => {
  const response = await getOrders();
  if (response.success == true) {
    pastOrders.value = response.orders
  } else {
    toast.error(`Error showing orders: ${response.error}`)
  }
}
watch(() => authStore.user, (newValue) => { callGetCart(); callGetOrders() });

const callAddToCart = async (itemId, amount) => {
  if (authStore.user) {
    const book = await getBook(itemId);
    if (book.success == true) {
      const response = await addToCart(book.book, amount);
      if (response.success == true) {
        if (amount == 0) {
          cart.value = cart.value.filter((item) => item.id !== itemId);
        } else {
          const foundItem = cart.value.find((item) => item.id === itemId);
          if (foundItem) {
            // Update the quantity of the found item
            foundItem.quantity = amount;
          }
        }
      } else {
        toast.error(`Error modifying cart: ${response.error}`)
      }
    } else {
      toast.error(`Error modifying cart: ${book.error}`)
    }
  } else {
    // toast.error('Login to add item to cart');
  }
}

onMounted(() => {
  callGetCart();
  callGetOrders();
});
</script>

<style lang="scss" scoped></style>