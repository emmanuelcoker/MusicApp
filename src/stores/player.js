import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },

  actions: {
    async newSong(song) {
      //check if there isnt another instance of music playing already befor creating a new one
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      //play music
      this.sound.play();

      //listen for play event and update seek and duraton
      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      //recursive action to continue updating the seek and duration by recalling progress method
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },

    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();

      //Document = 2000, Timeline = 1000, clientX = 1000, Distance = 500
      const clickX = event.clientX - x;
      const percentatage = clickX / width;
      const seconds = this.sound.duration() * percentatage;

      this.sound.seek(seconds);
      //pause the audio for a while before continuing playing
      this.sound.once("seek", this.progress);
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
  },
});
