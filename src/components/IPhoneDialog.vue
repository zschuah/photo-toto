<script>
export default {
  props: ["iPhoneDialogIsVisible", "photoFinal"],
  emits: ["hideiPhoneDialog"],
};
</script>

<template>
  <base-modal v-if="iPhoneDialogIsVisible" @close="$emit('hideiPhoneDialog')">
    <div class="text-center">
      <p>Displayed Images</p>
      <div class="row d-flex justify-content-center">
        <div class="my-frame" v-for="photo in photoFinal" :key="photo.id">
          <img class="img-fluid" :src="photo.imgPath" alt="corrupted" />
        </div>
      </div>
      <button class="btn btn-warning mt-2" @click="$emit('hideiPhoneDialog')">
        Close
      </button>
    </div>
  </base-modal>
</template>
