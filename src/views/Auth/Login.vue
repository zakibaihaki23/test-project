<template>
  <div id="login" class=".d-flex bigbk">
    <v-flex
      shrink
      pb-3
      class="pa-10 pb-8 text-center"
      style="margin-top: 200px: "
    >
      <div class="d-sm-flex d-md-none" style="margin-top: 100px">
        <v-layout justify-center align-center>
          <v-img class="gbr" src="@/assets/Logo-Login.png"></v-img>
        </v-layout>
      </div>
      <div class="d-none d-md-flex d-lg-none" style="margin-top: 100px">
        <v-layout justify-center align-center>
          <v-img class="gbr" src="@/assets/Logo-Login.png"></v-img>
        </v-layout>
      </div>
      <div class="d-none d-lg-flex" style="margin-top: 100px">
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
        <v-container class="login-container" fluid>
          <ValidationObserver ref="obs" v-slot="{ invalid, validated }">
            <v-form @submit.prevent="submit" ref="form" v-model="valid">
              <ValidationProvider rules="required">
                <v-text-field
                  prepend-inner-icon="mdi-account"
                  v-model="form.email"
                  label="E-Mail"
                  required
                  class="form"
                  flat
                  solo
                  :error-messages="error.email"
                  style="margin-top: 50px; width: 300px; margin-left: 35px"
                >
                </v-text-field>
              </ValidationProvider>
              <ValidationProvider rules="required">
                <v-text-field
                  prepend-inner-icon="mdi-lock"
                  v-model="form.password"
                  :error-messages="error.password"
                  label="Password"
                  :type="value ? 'password' : 'text'"
                  :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (value = !value)"
                  flat
                  @keyup.enter="submit"
                  solo
                  class="form"
                  style=" margin-top: 50px; width: 300px; margin-left: 35px"
                >
                  <v-spacer></v-spacer>
                </v-text-field>
              </ValidationProvider>
              <!-- <v-checkbox label="Remember Me"></v-checkbox> -->
              <v-btn
                style="height: 50px; width: 300px; margin-left: 35px"
                elevation="1"
                @click="submit"
                :loading="loading"
                :disabled="invalid || !validated"
              >
                <!----><!----><span>Login</span>
              </v-btn>
            </v-form>
          </ValidationObserver>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'

  export default {
    components: { ValidationObserver, ValidationProvider },
    name: 'Login',
    data() {
      return {
        form: {
          email: '',
          password: '',
          is_mobile: '0',
        },
        error: {},
        value: String,
        valid: true,
        loading: false,
      }
    },

    methods: {
      ...mapActions({
        signIn: 'auth/signIn',
      }),

      submit() {
        this.loading = true
        this.signIn(this.form)
          .then((response) => {
            this.loading = false
            window.location.reload()
            this.$router.push('/helper')
            this.$toast.success('Login Success')
          })

          .catch((error) => {
            this.error = error.response.data.errors
            this.$toast.error(error.response.data.errors.email)
            this.loading = false
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
