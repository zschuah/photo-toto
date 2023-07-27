<template>
  <section id="vue-mount">
    <div class="container">
      <!-- description row -->
      <div class="row text-center">
        <div class="col">
          <h1 id="game-title" class="display-1">Photo Toto</h1>
        </div>
      </div>

      <!-- button row -->
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-warning" @click="generateNewGame">
            New Game
          </button>
          <button v-if="!isReady" class="btn btn-success" @click="hideAnswers">
            I am ready!
          </button>
        </div>
      </div>

      <!-- game row -->
      <div id="game-row" class="row d-flex justify-content-center">
        <div class="scene" v-for="(photo, index) in photoFinal" :key="photo.id">
          <div
            class="card"
            :class="{ 'is-flipped': photo.isShown }"
            @click="flipPhoto(photo)"
          >
            <div
              class="card__face card__face--front d-flex justify-content-center align-items-center"
            >
              <h1>{{ index + 1 }}</h1>
            </div>
            <div class="card__face card__face--back d-flex">
              <img class="img-fluid" :src="photo.imgPath" alt="corrupted :(" />
            </div>
          </div>
        </div>
      </div>

      <div class="row text-center d-sm-none">
        <div class="col">
          <button
            v-if="!isReady"
            class="btn btn-secondary"
            @click="showiPhoneDialog"
          >
            Images not displaying
          </button>
        </div>
      </div>

      <!-- congratulations row -->
      <div class="row text-center">
        <div class="col">
          <h1
            id="congratulations"
            class="text-success"
            v-if="isCorrectAnswerFlipped"
          >
            Congratulations! You found the correct answer!
          </h1>
        </div>
      </div>

      <!-- CAN YOU FIND row -->
      <div
        id="question-row"
        class="row text-center d-flex justify-content-center"
        v-if="isReady"
      >
        <div class="col-6">
          <p class="mb-0">Can you find?</p>
          <h3>{{ tempAnswer?.name }}</h3>
          <img
            class="img-fluid"
            :src="tempAnswer?.imgPath"
            alt="corrupted :("
          />
        </div>
      </div>

      <!-- END OF ROWS -->
      <div style="margin-top: 100px"></div>
    </div>
  </section>

  <ReadyDialog
    :readyDialogIsVisible="readyDialogIsVisible"
    @hideReadyDialog="hideReadyDialog"
  />
  <WinDialog
    :winDialogIsVisible="winDialogIsVisible"
    @hideWinDialog="hideWinDialog"
    :gamesPlayed="gamesPlayed"
    :tries="tries"
    :averageTries="averageTries"
    :tryDistribution="tryDistribution"
    :tryMax="tryMax"
  />
  <IPhoneDialog
    :iPhoneDialogIsVisible="iPhoneDialogIsVisible"
    @hideiPhoneDialog="hideiPhoneDialog"
    :photoFinal="photoFinal"
  />

  <footer class="bg-warning fixed-bottom pb-1">
    <div class="container">Copyright © 2022 zschuah. All Rights Reserved.</div>
  </footer>
</template>

<script>
import ReadyDialog from "./components/ReadyDialog.vue";
import WinDialog from "./components/WinDialog.vue";
import IPhoneDialog from "./components/IPhoneDialog.vue";

import { photoData } from "./data/photoData";
import { photoPlaceholderData } from "./data/photoPlaceholderData";

export default {
  components: { ReadyDialog, WinDialog, IPhoneDialog },
  data() {
    return {
      //This will be toggled in mounted() to switch between game modes
      isPlaceHolderUsed: true,
      photoNum: [],
      photoFinal: [],
      //Be Kind SG volunteers
      photoList: photoData,
      //Pexels photos
      photoListPlaceHolder: photoPlaceholderData,
      tempAnswer: null,
      isReady: false,
      isCorrectAnswerFlipped: false,
      winDialogIsVisible: false,
      readyDialogIsVisible: true,
      iPhoneDialogIsVisible: false,

      gamesPlayed: 0,
      tries: 0,
      averageTries: 0,
      tryDistribution: [
        { id: 1, tries: 0 },
        { id: 2, tries: 0 },
        { id: 3, tries: 0 },
        { id: 4, tries: 0 },
        { id: 5, tries: 0 },
        { id: 6, tries: 0 },
        { id: 7, tries: 0 },
        { id: 8, tries: 0 },
        { id: 9, tries: 0 },
      ],
      tryMax: 1,
    };
  },
  computed: {
    averageTriesRounded() {
      return this.averageTries.toFixed(2);
    },
  },
  methods: {
    flipPhoto(photo) {
      if (this.isReady) {
        if (!photo.isShown) {
          photo.isShown = true;

          if (!this.isCorrectAnswerFlipped) {
            this.tries++;
          }
          if (photo.isAnswer) {
            this.gamesPlayed++;
            //Formula to add new value to average
            this.averageTries =
              this.averageTries +
              (this.tries - this.averageTries) / this.gamesPlayed;

            this.tryDistribution.forEach((tryBlock) => {
              if (tryBlock.id === this.tries) {
                tryBlock.tries++;
              }
              if (tryBlock.tries > this.tryMax) {
                this.tryMax = tryBlock.tries;
              }
            });
          }
        }

        if (photo.isAnswer) {
          this.isCorrectAnswerFlipped = true;
          this.winDialogIsVisible = true;
        }
      } else {
        // alert(`Please click on 'I am ready!' to start the game.`);
        this.showReadyDialog();
      }
    },
    generateRandBetween(min, max) {
      let num = Math.floor(Math.random() * (max - min + 1) + min);
      return num;
    },
    generateNewGame() {
      this.revealAnswers();
      this.resetGame();

      this.photoNum = [];
      this.photoFinal = [];

      // Generate 9 random numbers between 101 and 120 for PLACEHOLDER
      // Generate 9 random numbers between 101 and 112
      while (this.photoNum.length < 9) {
        let newNum = 0;
        if (this.isPlaceHolderUsed) {
          newNum = this.generateRandBetween(101, 120);
        } else {
          newNum = this.generateRandBetween(101, 112);
        }

        if (!this.photoNum.includes(newNum)) {
          this.photoNum.push(newNum);
        }
      }

      // Using the 9 numbers, extract photos from photoList to photoFinal
      for (let num of this.photoNum) {
        let found = this.photoList.find((el) => el.id == num);
        this.photoFinal.push(found);
      }

      // Select 1 photo to be the correct answer
      let answerNum = this.generateRandBetween(0, 8);
      this.photoFinal[answerNum].isAnswer = true;
      this.tempAnswer = this.photoFinal[answerNum];

      //   console.log("Answer is:");
      //   console.log(answerNum + 1);
      //   console.log(this.tempAnswer);
    },
    revealAnswers() {
      for (let photo of this.photoFinal) {
        photo.isShown = true;
      }
    },
    hideAnswers() {
      for (let photo of this.photoFinal) {
        photo.isShown = false;
      }
      this.isReady = true;
    },
    resetGame() {
      this.tempAnswer = null;
      for (let photo of this.photoList) {
        photo.isAnswer = false;
      }
      this.isCorrectAnswerFlipped = false;
      this.isReady = false;

      this.tries = 0;
    },
    showWinDialog() {
      this.winDialogIsVisible = true;
    },
    hideWinDialog() {
      this.winDialogIsVisible = false;
    },
    showReadyDialog() {
      this.readyDialogIsVisible = true;
    },
    hideReadyDialog() {
      this.readyDialogIsVisible = false;
    },
    showiPhoneDialog() {
      this.iPhoneDialogIsVisible = true;
    },
    hideiPhoneDialog() {
      this.iPhoneDialogIsVisible = false;
    },
  },
  mounted() {
    console.log("App mounted!");

    if (this.isPlaceHolderUsed) {
      this.photoList = this.photoListPlaceHolder.slice();
    }

    this.generateNewGame();
  },
};
</script>

<style>
#game-row,
#question-row {
  border: 5px solid black;
  max-width: 30rem;
  margin: auto;
}

.scene {
  width: 120px;
  height: 120px;
  perspective: 600px;
  cursor: pointer;
  padding-left: 0;
  padding-right: 0;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
}
.card__face {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}

.card__face--front {
  background: orange;
}
.card__face--back {
  background: whitesmoke;
  transform: rotateY(180deg);
}

.card.is-flipped {
  transform: rotateY(180deg);
}

footer {
  font-size: 0.8rem;
  text-align: right;
}

.my-frame {
  width: 120px;
  height: 120px;
  display: flex;
}

img {
  width: 100%;
  object-fit: cover;
}

/* Small devices (landscape phones)*/
@media (max-width: 767px) {
  #game-row,
  #question-row {
    max-width: 20rem;
  }
  #congratulations {
    font-size: 1.2rem;
  }
  .scene {
    width: 90px;
    height: 90px;
  }

  #game-title {
    font-size: 3rem;
  }

  .my-frame {
    width: 90px;
    height: 90px;
  }
}
</style>
