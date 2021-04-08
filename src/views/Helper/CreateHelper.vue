<template>
  <div class="regist">
    <h1>CREATE HELPER</h1>
    <v-row></v-row>
    <ValidationObserver ref="obs" v-slot="{ invalid, validated, save }">
      <v-form>
        <v-row>
          <v-col cols="12" sm="6" lg="6" md="6">
            <div class="form-right-1">
              <p>Name <span style="color: red;">*</span></p>
              <v-text-field
                single-line
                label="Name *"
                outlined
                class="form"
                v-model="helper.name"
                :error-messages="error.name"
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col cols="12" sm="6" lg="6" md="6">
            <div class="form-right-1">
              <p>Phone Number <span style="color: red">*</span></p>
              <v-text-field
                :rules="[rules.counter, rules.phone_number]"
                maxlength="12"
                v-model="helper.phone_number"
                label="Phone Number *"
                outlined
                class="form"
                single-line
                :error-messages="error.phone_number"
              >
              </v-text-field>
              {{ helper.phone_number }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" lg="6" md="6">
            <div class="form-right">
              <p>Type <span style="color: red">*</span></p>
              <v-select
                label="Type *"
                single-line
                outlined
                class="form"
                item-text="type_name"
                item-value="id"
                v-model="type_id"
                :items="types"
                :error-messages="error.type_id"
              >
              </v-select>
            </div>
          </v-col>
          <v-col cols="12" sm="6" lg="6" md="6">
            <div class="form-right">
              <p>Warehouse <span style="color: red">*</span></p>
              <v-autocomplete
                clearable
                :items="warehouse"
                item-text="name"
                item-value="value"
                label="Warehouse *"
                outlined
                single-line
                class="form"
                v-model="warehouse_id"
                append-icon=""
                :error-messages="error.warehouse_id"
              >
              </v-autocomplete>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="form-right">
              <p>Address</p>
              <v-textarea
                :counter="20"
                :max-length="20"
                v-model="helper.address"
                outlined
                single-line
                class="form"
                label="Address"
              >
              </v-textarea>
            </div>
          </v-col>
        </v-row>

        <h1 style="margin-top: 20px">CREDENTIAL</h1>
        <v-row style="margin-top: 20px">
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider
                name="E-mail"
                rules="required|email"
                v-slot="{ errors }"
              >
                <p>Email <span style="color: red">*</span></p>
                <v-text-field
                  label="Email *"
                  outlined
                  single-line
                  class="form"
                  v-model="helper.username"
                  :error-messages="errors"
                >
                </v-text-field>
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6" class="form-right"> </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <p>Password <span style="color: red;">*</span></p>
              <v-text-field
                label="Password *"
                outlined
                single-line
                class="form"
                v-model="helper.password"
                :type="value ? 'password' : 'text'"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :error-messages="error.password"
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <p>Confirm Password <span style="color: red">*</span></p>
              <v-text-field
                label="Confirm Password *"
                outlined
                single-line
                class="form"
                v-model="helper.confirm_password"
                :type="val_confirm ? 'password' : 'text'"
                :append-icon="val_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (val_confirm = !val_confirm)"
                :error-messages="error.confirm_password"
              >
              </v-text-field>
            </div>
          </v-col>
        </v-row>
        <br />
        <br /><br />

        <v-divider></v-divider>
        <div class="btn">
          <v-row>
            <v-col md="10" sm="9" cols="5" lg="10" class="text-right">
              <v-btn
                :to="{ path: '/helper' }"
                color="#E6E9ED"
                style="margin: 10px; color: #768F9C"
                class="cancel"
                >Cancel</v-btn
              >
            </v-col>
            <v-col md="1" sm="2" cols="5" lg="1" class="text-right">
              <v-btn
                style="margin: 10px;"
                class="save"
                @click="save"
                :loading="loading"
                :disabled="invalid || !validated"
                >Save</v-btn
              >
              <!-- <v-btn
              v-else
              :disabled="invalid || !validated"
              style="margin: 10px;"
              class="save"
              >Save</v-btn
            > -->
            </v-col>
          </v-row>
        </div>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  export default {
    components: { ValidationProvider, ValidationObserver },
    data() {
      return {
        saveDisabled: true,
        loading: false,
        rules: {
          required: (value) => !!value || 'Required',
          counter: (value) => value.length <= 12 || 'Max 30 Characters',
          phone_number: (val) => {
            if (val < 0) return 'Please enter a positive number'
            return true
          },
        },
        helper: {
          name: '',
          address: '',
          phone_number: '',
          password: '',
          confirm_password: '',
          username: '',
        },
        value: String,
        val_confirm: String,
        warehouse: '',
        warehouse_id: '',
        type_id: '',
        types: '',
        error: {},
      }
    },
    created() {
      this.renderData()
    },

    methods: {
      //untuk mendapatkan list warehouse dari API
      renderData() {
        this.$http
          .get('/warehouse', {
            params: {
              conditions: 'is_archived:0',
            },
          })
          .then((response) => {
            this.warehouse = []
            let array = response.data.data
            for (let i = 0; i < array.length; i++) {
              this.warehouse.push({
                name: array[i].warehouse_name,
                value: array[i].id,
              })
            }
          })
        //untuk mendapatkan list type Helper dari API
        this.$http.get('/helper/helpertype').then((response) => {
          this.types = response.data.data
        })
      },
      //untuk menyimpan data registrasi ke dalam API
      save() {
        this.loading = true
        this.$http
          .post('/helper', {
            warehouse_id: this.warehouse_id,
            type_id: this.type_id,
            name: this.helper.name,
            username: this.helper.username,
            phone_number: this.helper.phone_number,
            address: this.helper.address,
            password: this.helper.password,
            confirm_password: this.helper.confirm_password,
          })

          .then((response) => {
            this.$router.push('/helper')
            this.$toast.success('Data has been saved successfully')
          })
          .catch((error) => {
            this.loading = false
            this.error = error.response.data.errors
            this.$toast.error('all required field must be filled')
          })
      },
    },
  }
</script>

<style scoped>
  .regist {
    padding-left: 80px;
    padding-right: 50px;
  }
  .form-right {
    padding-right: 90px;
    font-size: 20px;
  }
  .form-right-1 {
    margin-top: 50px;
    padding-right: 90px;
    font-size: 20px;
  }
  .form-credential {
    margin-top: 20px;
    padding-right: 90px;
  }

  .name {
    border-radius: 15px;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    margin-top: 50px;
    background: #4662d4;
    color: white;
    box-sizing: content-box;
    border-radius: 25px;
    width: 111px;
    height: 45px;
    padding: 4px;
  }
  .btn {
    margin-top: 30px;
  }
  .form {
    border-radius: 10px;
    border-style: none;
    text-decoration: none;
  }
</style>
