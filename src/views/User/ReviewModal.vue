<template>
  <Modal>
    <template v-slot:button>
      <div ref="modalRef"></div>
      <slot name="button"></slot>
    </template>
    <template v-slot:content>
      <div class="w-64 sm:w-96 md:w-[500px] lg:w-[700px] h-fit">
        <form @submit.prevent="submitForm">
          <div v-if="bookId && orderId" class="flex gap-2 flex-col w-full">
            <h3 class="text-title-large font-display ">Reviewing {{ bookTitle ? bookTitle : 'Book' }} </h3>
            <div class="w-full">
              <p class="text-label-large mb-1">Rating</p>
              <star-rating :rating="rating" :read-only="false" active-color="#FFD700" text-class="hidden"
              @update:rating ="(newRating)=>rating=newRating"
                star-size="20" />
            </div>
            <div class="w-full">
              <p class="text-label-large mb-1">Review</p>
              <textarea class="input !p-[6px] h-28" v-model="review" placeholder="Review" required />
            </div>
            <CustomButton type="submit">Review</CustomButton>
          </div>
          <div v-else class="px-3 py-5 w-48">
            <p class="text-label-large text-outline text-center">Please select a book to review 🙃</p>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import { ref } from 'vue';
import { toast } from "vue3-toastify";
import StarRating from 'vue-star-rating';
import "vue3-toastify/dist/index.css";
import CustomButton from '@/components/CustomButton.vue';
import { addReview } from '@/assets/js/firebase';

const props = defineProps({
  bookId: {
    type: String,
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  }
});

const modalRef = ref(null);
const rating = ref(1);
const review = ref('');



const submitForm = async () => {
  if (rating.value && review.value) {
    const response = await addReview(props.bookId, props.orderId, rating.value, review.value);
    if (response.success == true) {
      modalRef.value.click();
      toast.success(`Review added`);
    } else {
      toast.error(`Error adding review: ${response.error}`)
    }
  } else {
    toast.error('Please fill in all the information')
  }
}


</script>

<style lang="scss" scoped></style>