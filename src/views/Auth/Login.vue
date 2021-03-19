<template>
  <div id="login" class="bigbk">
    <div>
      <v-img class="gbr" src="@/assets/Logo-Login.png"></v-img>
    </div>
    <div>
      <v-container class="login-container">
        <v-form @submit.prevent="submit" ref="form" v-model="valid">
          <!-- <v-card-title>
          <v-img
            src="https://www.static-src.com/wcsstore/Indraprastha/images/catalog/mlogo/EDF-60021.png"
          ></v-img
        ></v-card-title> -->
          <v-text-field
            prepend-inner-icon="mdi-account"
            v-model="form.email"
            label="E-Mail"
            required
            class="form"
            flat
            solo
            style="margin-bottom: 30px; margin-top: 50px; width: 300px; margin-left: 50px"
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
            style=" margin-top: 50px; width: 300px; margin-left: 50px"
          >
            <v-spacer></v-spacer>
          </v-text-field>
          <!-- <v-checkbox label="Remember Me"></v-checkbox> -->
          <v-btn
            style="height: 50px; width: 300px; margin-left: 50px"
            elevation="1"
            depressed
            type="submit"
          >
            <!----><!----><span>Login</span>
          </v-btn>
        </v-form>
      </v-container>
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
            this.$toast.error(error.response.data.message, {
              position: 'top-right',
              timeout: 5000,
              closeOnClick: true,
              pauseOnFocusLoss: false,
              pauseOnHover: false,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: false,
              hideProgressBar: true,
              closeButton: 'button',
              icon: true,
              rtl: false,
            })
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
    position: absolute;
    width: 420px;
    height: 350px;
    left: 525px;
    margin: 220px;
    top: 150px;
    background: linear-gradient(
      179.68deg,
      #99cdb7 -115.48%,
      rgba(136, 207, 177, 0.06) 99.69%
    );
    border-radius: 20px;
  }
  .form {
    width: 400px;
    height: 50px;
    border-radius: 15px;
    padding: 20px;
    margin: 10px;
    left: 50px;
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
    left: 670px;
    margin: 220px;
  }
</style>
