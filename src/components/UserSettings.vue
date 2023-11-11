<template>
  <Modal>
    <template v-slot:button>
      <slot name="button"></slot>
    </template>
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <div v-if="authStore.user" class="flex gap-4 max-md:flex-col">
          <div class="w-fit md:w-32 relative h-fit">
            <!-- <img v-if="authStore.user.photoURL" :src="authStore.user.photoURL" alt="avatar" -->
            <img v-if="imageUrl || authStore.user.photoURL" :src="imageUrl || authStore.user.photoURL" alt="avatar"
              class="rounded-full h-24 w-24 md:h-32 md:w-32">
            <i v-else class='bx bxs-user-circle text-8xl md:text-9xl'></i>
            <input type="file" accept="image/*" @change="handleImageSelection" ref="fileInput" style="display: none" />
            <i class='absolute -right-1 md:right-[5%] -bottom-1 bx bx-camera z-10 bg-primary-primary_container text-primary-on_primary_container px-2 py-1 rounded-full text-xl cursor-pointer hover:bg-opacity-70'
              @click="openFileInput"></i>
          </div>
          <div class="flex flex-col gap-2 ">
            <input class="text-title-large font-Abril_Fatface bg-inherit" v-model="displayName" placeholder="Username"
              required>
            <input class="text-body-medium text-ellipsis bg-inherit" v-model="email" placeholder="email" required
              :readonly="!editEmail">
            
            <div class="grow min-h-[10px]"></div>
            <div class="grow min-h-[10px]"></div>
            <div class="flex justify-end">
              <button type="submit" class="button font-medium bg-primary-primary text-primary-on_primary">Save</button>
            </div>
          </div>
        </div>
      </form>
    </template>
  </Modal>
</template>

<script>
import { useAuthStore } from '@/store/authStore';
import Modal from './Modal.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { updateUser, updateRole } from "@/assets/js/firebase";

export default {
  components: { Modal },
  setup() {
    const authStore = useAuthStore();
    const displayName = ref("Username");
    const email = ref("email");
    const editEmail = ref(true);
    const fileInput = ref(null);
    const imageFile = ref(null);
    const imageUrl = ref(null);
    const updateEmail = ref('');
    const newRole = ref('user');

    onMounted(() => {
      displayName.value = authStore.user ? authStore.user.displayName : "Username";
      email.value = authStore.user ? authStore.user.email : "email";

      const hasOtherProvider = authStore.user ? authStore.user.providerData.some(provider => provider.providerId !== 'password') : false;
      if (hasOtherProvider) {
        editEmail.value = false;
      }
    });

    onUnmounted(() => {
      imageFile.value = null;
      imageUrl.value = null;
      displayName.value = authStore.user ? authStore.user.displayName : "Username";
      email.value = authStore.user ? authStore.user.email : "email";
    })

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

        // Check if the image is square
        const image = new Image();
        image.src = URL.createObjectURL(selectedFile);
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          if (width === height) {
            imageFile.value = selectedFile;
            imageUrl.value = URL.createObjectURL(selectedFile);
          } else {
            toast.error('Please select a square image.');
          }
        };
      }
    };

    const callUpdateRole = async () => {
      if (updateEmail.value) {
        const result = await updateRole(updateEmail.value, newRole.value);
        if (result.success) {
          updateEmail.value = '';
          newRole.value = 'user';
          toast.success(`${updateEmail.value} updated to ${newRole.value}`);
        } else {
          toast.error(`Error updating ${updateEmail.value}: ${result.error}`);
        }
      }
    };

    const submitForm = async () => {
      if (imageFile.value || displayName.value !== authStore.user.displayName || email.value !== authStore.user.email) {
        const result = await updateUser(imageFile.value, imageFile.value ? imageFile.value.type.split('/').pop() : 'jpg', displayName.value, email.value);
        if (result.success) {
          toast.success('Account updated');
        } else {
          toast.error(`Error updating account: ${result.error}`);
        }
      }
    }

    return { authStore, displayName, email, editEmail, openFileInput, handleImageSelection, fileInput, imageUrl, submitForm, callUpdateRole, newRole, updateEmail };
  },
}
</script>

<style lang="scss" scoped></style>