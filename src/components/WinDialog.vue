<script>
import fireworksImg from "../assets/fireworks.jpeg";

export default {
  props: [
    "winDialogIsVisible",
    "gamesPlayed",
    "tries",
    "averageTries",
    "tryDistribution",
    "tryMax",
  ],
  emits: ["hideWinDialog"],
  data() {
    return {
      fireworksImg: fireworksImg,
    };
  },
  methods: {
    styledBar(tryBlock) {
      return {
        "--size": tryBlock.tries / this.tryMax,
        "--color": this.tries === tryBlock.id ? "green" : "#262626",
      };
    },
  },
  computed: {
    averageTriesRounded() {
      return this.averageTries.toFixed(2);
    },
    tryWording() {
      if (this.tries === 1) {
        return "try";
      } else {
        return "tries";
      }
    },
  },
};
</script>

<template>
  <base-modal v-if="winDialogIsVisible" @close="$emit('hideWinDialog')">
    <div class="text-center">
      <p class="text-success font-weight-bold">
        Congratulations! You found the correct answer with {{ tries }}
        {{ tryWording }}!
      </p>
      <p>
        <span>Games Played: {{ gamesPlayed }}</span>
        <span class="ml-3">Average: {{ averageTriesRounded }}</span>
      </p>

      <!-- <p>{{ tryDistribution }}</p> -->

      <p class="font-weight-bold">Try Distribution</p>
      <table
        id="my-chart"
        class="charts-css bar show-labels show-6-secondary-axes data-spacing-1"
      >
        <thead>
          <tr>
            <th scope="col">Try Block</th>
            <th scope="col">Tries</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tryBlock in tryDistribution" :key="tryBlock.id">
            <th scope="row">{{ tryBlock.id }}</th>
            <td :style="this.styledBar(tryBlock)">
              <span class="data">
                {{ tryBlock.tries }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <img class="img-fluid" :src="fireworksImg" alt="fireworks" /> -->
      <button class="btn btn-warning mt-2" @click="$emit('hideWinDialog')">
        Close
      </button>
    </div>
  </base-modal>
</template>

<style scoped>
/* #my-chart {
  --color-1: rgba(29, 111, 66, 1);
  --color-2: rgba(29, 111, 66, 1);
  --color-3: rgba(29, 111, 66, 0.9);
  --color-4: rgba(29, 111, 66, 0.9);
  --color-5: rgba(29, 111, 66, 0.8);
  --color-6: rgba(29, 111, 66, 0.8);
  --color-7: rgba(29, 111, 66, 0.7);
  --color-8: rgba(29, 111, 66, 0.7);
  --color-9: rgba(29, 111, 66, 0.6);
} */
#my-chart .data {
  color: white;
  font-weight: bold;
  margin-right: 0.5rem;
}
</style>
