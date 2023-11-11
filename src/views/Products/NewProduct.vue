<template>
  <NavSection />
  <CustomSection>
    <form @submit.prevent="submitForm">
      <CustomSectionHeader title="Add to Inventory" class="mb-4" />
      <div class=" w-full flex max-md:flex-col gap-4">
        <div class=" w-full md:w-4/12 p-1 cursor-pointer" @click="openFileInput">
          <img v-if="imageUrl" :src="imageUrl" alt="Image" class="w-full aspect-[2/3] rounded-md">
          <div v-else class=' w-full aspect-[2/3] bg-surface-surface_variant rounded-md flex justify-center items-center'>
            <p class=" text-display-large font-semibold text-outline">+</p>
          </div>
          <input type="file" accept="image/*" @change="handleImageSelection" ref="fileInput" style="display: none" />
        </div>
        <div class="w-full md:w-6/12 flex flex-col gap-2">
          <CustomSectionHeader heading="book" class="" />
          <input
            class="text-headline-large sm:text-display-small text-surface-on_surface font-bold font-Abril_Fatface rounded-md p-1"
            v-model="title" placeholder="Title" required>
          <input class="text-secondary-secondary text-label-large rounded-md p-1" v-model="category"
            placeholder="Category" required>
          <h4 class=" text-title-large">Description</h4>
          <textarea class="text-surface-on_surface_variant rounded-md p-1 h-28" v-model="description"
            placeholder="Description" required />
          <star-rating :rating="0" :read-only="true" active-color="#FFD700" text-class="hidden" star-size="20" />
          <p class=" font-medium">
            <strong>Stock: </strong>
            <input class="text-secondary-secondary text-label-large rounded-md p-1" type="number" v-model="total"
              placeholder="0" required>
          </p>
          <p class=" text-body-large font-semibold"><strong>Price: </strong> KSH
            <input class="text-secondary-secondary text-label-large rounded-md p-1" type="number" v-model="price"
              placeholder="0" required></p>
          <CustomButton type="submit" class="mt-4">Create inventory</CustomButton>
        </div>
      </div>
    </form>
  </CustomSection>
  <FooterSection/>
</template>

<script setup>
import { addBook } from '@/assets/js/firebase';
import CustomSection from '@/components/CustomSection.vue'
import CustomSectionHeader from '@/components/CustomSectionHeader.vue'
import { ref } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import StarRating from 'vue-star-rating';
import NavSection from '@/components/NavSection.vue';
import CustomButton from '@/components/CustomButton.vue';
import FooterSection from '@/components/FooterSection.vue';


const title = ref('');
const description = ref('');
const category = ref('');
const price = ref(0);
const total = ref(0);
const fileInput = ref(null);
const imageFile = ref(null);
const imageUrl = ref(null);

const submitForm = async () => {
  if (title.value && category.value && price.value && description.value && total.value && imageFile.value) {
    const response = await addBook(title.value, category.value, price.value, description.value, total.value, imageFile.value);
    if (response.success) {
      toast.success('Inventory added');
    } else {
      toast.error(`Error adding inventory: ${response.error}`)
    }
  } else {
    toast.error('Please fill in all the information');
  }
}
const openFileInput = () => {
  fileInput.value.click();
};
const handleImageSelection = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    // Check the file size (2MB limit)
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('Please select an image file smaller than 2MB.');
      return;
    }
    imageFile.value = selectedFile;
    imageUrl.value = URL.createObjectURL(selectedFile);
  }
};

</script>

<style lang="scss" scoped></style>