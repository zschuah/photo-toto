<script>
export default {
  props: ["readyDialogIsVisible"],
  emits: ["hideReadyDialog"],
};
</script>

<template>
  <base-modal v-if="readyDialogIsVisible" @close="$emit('hideReadyDialog')">
    <div class="text-center">
      <div class="text-left">
        <p>Hi there! Welcome to Photo Toto. Here are your objectives:</p>
        <ul>
          <li>Memorise the 9 images shown</li>
          <li>Find the location of a randomly selected image</li>
        </ul>
      </div>

      <p>
        Click on
        <span class="text-success font-weight-bold">'I am ready!'</span>
        to start the game.
      </p>
      <button class="btn btn-warning mt-2" @click="$emit('hideReadyDialog')">
        Close
      </button>
    </div>
  </base-modal>
</template>
