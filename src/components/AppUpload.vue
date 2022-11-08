<template>
  <div class="col-span-1">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <!-- Upload Dropbox -->
        <div
          class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="is_dragover = false"
          @dragover.prevent.stop="is_dragover = true"
          @dragenter.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false"
          @drop.prevent.stop="upload($event)"
        >
          <input type="file" multiple @change="upload($event)" />
          <h5>Drop your files here</h5>
        </div>
        <hr class="my-6" />
        <!-- Progess Bars -->
        <div v-for="upload in uploads" class="mb-4" :key="upload.name">
          <!-- File Name -->
          <div class="font-bold text-sm" :class="upload.text_class">
            <i :class="upload.icon"></i>
            {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div
              class="transition-all progress-bar bg-blue-400"
              :class="upload.variant"
              :style="{ width: upload.current_progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, storage, songsCollection } from "@/includes/firebase";

export default {
  name: "AppUpload",
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: ["addSong"],
  methods: {
    upload($event) {
      //remove the bg of dragover panel
      this.is_dragover = false;

      //retrieve the files uploaded from the drop event or click upload event
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      //iterate each file
      files.forEach((file) => {
        //accept only mp3 audio files
        if (file.type !== "audio/mpeg") {
          return;
        }

        //store the firebase storage as a reference
        const storageRef = storage.ref();
        //create a child path in the storage reference
        const songsRef = storageRef.child(`songs/${file.name}`);
        //store the file
        const task = songsRef.put(file);

        //push the task information into the uploads array and get the last index
        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1;

        //on state change event durig upload update upload progress percentage
        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].text_class = "text-red-400";
            console.log(error);
          },
          async () => {
            //store data database
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            //get download link to retrieve the music
            song.url = await task.snapshot.ref.getDownloadURL();
            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();
            this.addSong(songSnapshot);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].text_class = "text-green-400";
          }
        );
      });

      // console.log(files);
    },
    // cancelUploads() {
    //   this.uploads.forEach((upload) => {
    //     upload.task.cancel();
    //   });
    // },
  },

  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
