<template>
  <!-- Login Form -->
  <div
    class="text-center text-white rounded font-bold p-4 mb-4"
    v-if="login_alert"
    :class="login_variant"
  >
    {{ login_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <error-message name="email" class="text-red-500"></error-message>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <error-message name="password" class="text-red-500"></error-message>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "LoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|email|min:10|max:150",
        password: "required|min:9|max:100",
      },

      login_submission: false,
      login_variant: "bg-blue-500",
      login_alert: false,
      login_msg: "Please Wait! Login processing.",
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),

    async login(values) {
      this.login_submission = true;
      this.login_alert = true;
      this.login_msg = "Please Wait! We are Logging you in.";
      this.login_variant = "bg-blue-500";

      try {
        await this.authenticate(values);
      } catch (error) {
        this.login_submission = false;
        this.login_msg = "Invalid Login Details";
        this.login_variant = "bg-red-500";
        return;
      }

      this.login_msg = "Success! Login Successful.";
      this.login_variant = "bg-green-500";
      console.log(values);
      window.location.reload();
    },
  },
};
</script>

<style scoped></style>
