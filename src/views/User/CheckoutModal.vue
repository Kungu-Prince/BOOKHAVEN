<template>
  <Modal>
    <template v-slot:button>
      <div ref="modalRef"></div>
      <slot name="button"></slot>
    </template>
    <template v-slot:content>
      <div class="w-64 sm:w-96 md:w-[500px] lg:w-[700px] h-fit">
        <form @submit.prevent="submitForm">
          <div v-if="cart" class="flex gap-2 flex-col w-full">
            <h3 class="text-title-large font-display ">Checkout </h3>
            <h4 class=" text-title-medium">Items: {{ cart.length }}</h4>
            <h4 class=" text-title-medium">Total: KSH{{ totalamount.toLocaleString() }}</h4>
            <div class=" flex flex-col gap-2">
              <p class="text-title-small font-display">Personal Information</p>
              <div class="w-full">
                <p class="text-label-large mb-1">Address</p>
                <input v-model="address" type="text" name="address" placeholder="Address" class="input !p-[6px]" required>
              </div>
            </div>
            <div class="flex flex-col gap-3 w-full">
              <h3 class="text-title-large font-display ">Payment Details</h3>
              <hr class="w-full border-outline-variant ">
              <h3 class="text-title-medium">Mpesa</h3>
              <div class="w-full">
                <p class="text-label-large mb-1">Phone Number</p>
                <input v-model="number" name="phone" type="number" placeholder="07. . ." class="input !p-[6px]" required>
              </div>
              <p class="text-surface-on-variant text-label-medium">Please ensure you have your phone near you. You will
                receive a prompt on the number above this payment.
                Enter your M-Pesa PIN to authorize the payment.</p>
              <CustomButton type="submit">Make Payment</CustomButton>
            </div>

          </div>
          <div v-else class="px-3 py-5 w-48">
            <p class="text-label-large text-outline text-center">Please add items to cart 🙃</p>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CustomButton from '@/components/CustomButton.vue';
import { makeOrder } from '@/assets/js/firebase';

const props = defineProps({
  cart: {
    type: Object,
    required: true,
  }
});

const modalRef = ref(null);
const address = ref('');
const number = ref();
const totalamount = ref(0);

const calculateAmount = (items) => {
  totalamount.value = 0;
  for (const item of items) {
    totalamount.value = totalamount.value + (item.price * item.quantity);
  }
}
watch(() => props.cart, (newValue) => calculateAmount(newValue));

onMounted(() => {
  calculateAmount(props.cart);
})

const submitForm = async () => {
  if (number.value && number.value.toString().length === 9) {
    toast.success('Processing order...')
    const response = await makeOrder(props.cart, number.value, address.value);
    if (response.success == true) {
      modalRef.value.click();
      toast.success(`Request for KSH ${totalamount.value} sent to +254${number.value}`);
    } else {
      toast.error(`Error processing order: ${response.error}`)
    }
  } else {
    toast.error('Please enter a valid phone number')
  }
}


</script>

<style lang="scss" scoped></style>