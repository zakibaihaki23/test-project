<template>
  <div id="login" class="bigbk">
    <v-flex
      shrink
      pb-3
      class="pa-10 pb-8 text-center"
      style="margin-top: 200px: "
    >
      <div class="text-center pb-4" style="margin-top: 200px">
        <v-layout justify-center align-center>
          <v-img class="gbr" src="@/assets/Logo-Login.png"></v-img>
        </v-layout>
      </div>
    </v-flex>
    <div>
      <v-card
        class="mx-auto rounded-xl login-container Heiti"
        max-width="390"
        flat
        style="bottom: 250px;"
      >
        <v-container class="login-container">
          <v-form @submit.prevent="submit" ref="form" v-model="valid">
            <v-text-field
              prepend-inner-icon="mdi-account"
              v-model="form.email"
              label="E-Mail"
              required
              class="form"
              flat
              solo
              style="margin-top: 50px; width: 300px; margin-left: 35px"
            >
            </v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="form.password"
              label="Password"
              :type="value ? 'password' : 'text'"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              flat
              solo
              class="form"
              style=" margin-top: 50px; width: 300px; margin-left: 35px"
            >
              <v-spacer></v-spacer>
            </v-text-field>
            <!-- <v-checkbox label="Remember Me"></v-checkbox> -->
            <v-btn
              style="height: 50px; width: 300px; margin-left: 35px"
              elevation="1"
              depressed
              type="submit"
            >
              <!----><!----><span>Login</span>
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Login',
    data() {
      return {
        form: {
          email: '',
          password: '',
          is_mobile: '0',
        },
        value: String,
        valid: true,

        // emailRules: [(v) => !!v || 'E-mail is required'],
        // passwordRules: [
        //   (v) => !!v || 'Password is required',
        //   (v) => (v && v.length >= 5) || 'Password must 5 characters',
        // ],
      }
    },

    methods: {
      ...mapActions({
        signIn: 'auth/signIn',
      }),

      submit() {
        this.signIn(this.form)
          .then(() => {
            window.location.reload()
            this.$router.push('/helper')
          })
          .catch((error) => {
            this.$toast.error(error.response.data.errors.id)
          })
      },
    },
  }
</script>

<style scoped>
  .bigbk {
    background-image: url('https://i.ibb.co/F059nXj/Login.jpg');
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .login-container {
    mix-blend-mode: normal;
    margin-top: 327px;
    height: 350px;
    border-style: 0;
    background: linear-gradient(
      179.68deg,
      #99cdb7 -115.48%,
      rgba(136, 207, 177, 0.06) 99.69%
    );
    border-radius: 20px;
  }
  .form {
    height: 50px;
    border-radius: 15px;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  button {
    position: absolute;
    width: 400px;
    height: 500px;
    margin-top: 60px;
    background: #808080;
    border-radius: 100px;
    cursor: pointer;
    text-transform: capitalize;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .gbr {
    position: absolute;
  }
</style>
