<template>
  <div class="regist">
    <h1>UPDATE HELPER</h1>
    <v-row></v-row>
    <ValidationObserver ref="obs" v-slot="{ invalid, validated }">
      <v-form>
        <v-row>
          <v-col cols="12" sm="6" lg="6" md="6" style="margin-right: 90px">
            <div class="form-right-1">
              <ValidationProvider rules="required">
                <p style="color: gray">Helper ID *</p>
                <v-text-field
                  disabled
                  v-model="helper.code"
                  outlined
                  single-line
                  class="form"
                >
                </v-text-field>
              </ValidationProvider>
            </div>
          </v-col>
          <!-- </v-row> -->
          <!-- <v-row no-gutters> -->
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
                <p>Name <span style="color: red">*</span></p>
                <v-text-field
                  label="Name"
                  v-model="helper.name"
                  outlined
                  single-line
                  class="form"
                  :error-messages="error.name"
                >
                </v-text-field>
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
                <p>Type <span style="color: red">*</span></p>
                <v-select
                  v-model="type_id"
                  :items="type"
                  item-text="type_name"
                  item-value="id"
                  @selected="typeSelected"
                  outlined
                  single-line
                  class="form"
                >
                </v-select>
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
                <p>Phone Number <span style="color: red">*</span></p>
                <v-text-field
                  maxlength="12"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  label="Phone Number"
                  v-model="helper.phone_number"
                  outlined
                  single-line
                  class="form"
                  :error-messages="error.phone_number"
                >
                </v-text-field>
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
                <p>Warehouse <span style="color: red">*</span></p>
                <v-autocomplete
                  :items="warehouse"
                  v-model="warehouse_list"
                  item-text="warehouse_name"
                  item-value="id"
                  @selected="warehouseSelected"
                  outlined
                  single-line
                  class="form"
                  append-icon=""
                >
                </v-autocomplete>
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="form-right">
              <p>Address</p>
              <v-textarea
                :counter="20"
                :rules="rules"
                :max-length="20"
                label="Address"
                v-model="helper.address"
                outlined
                single-line
                class="form"
              >
              </v-textarea>
            </div>
          </v-col>
        </v-row>

        <!-- </v-row> -->

        <h1 style="margin-top: 20px">CREDENTIAL</h1>
        <v-row style="margin-top: 20px">
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
                <p style="color: gray">Email *</p>
                <v-text-field
                  label="Email *"
                  outlined
                  disabled
                  single-line
                  class="form"
                  v-model="helper.username"
                >
                </v-text-field>
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6"> </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
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
              </ValidationProvider>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <div class="form-right">
              <ValidationProvider rules="required">
                <p>Confirm Password <span style="color: red">*</span></p>
                <v-text-field
                  label="Confirm Password *"
                  outlined
                  single-line
                  class="form"
                  v-model="helper.confirm_password"
                  :type="value ? 'password' : 'text'"
                  :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (value = !value)"
                  :error-messages="error.confirm_password"
                >
                </v-text-field>
              </ValidationProvider>
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
            <v-col md="1" sm="2" cols="7" lg="1" class="text-right">
              <v-btn
                style="margin: 10px;"
                class="save"
                :loading="loading"
                v-if="!invalid && !validated"
                @click="save"
                >Save</v-btn
              >
              <v-btn
                style="margin: 10px;"
                class="save"
                :loading="loading"
                v-else
                :disabled="invalid || !validated"
                @click="save"
                >Save</v-btn
              >
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
        edit: '',
        rules: [(v) => v.length <= 20 || 'Max 20 characters'],
        value: String,
        editedIndex: -1,
        warehouse: '',
        warehouse_list: '',
        warehouse_id: '',
        loading: false,
        types: '',
        type: '',
        type_id: '',
        helper: {
          code: '',
          username: '',
          phone_number: '',
          warehouse_name: '',
          name: '',
          type: '',
          address: '',
          password: '',
          confirm_password: '',
        },
        error: {},
      }
    },
    created() {
      this.renderData()
    },

    methods: {
      //untuk mendapatkan data dari API ke dalam format text-field
      renderData() {
        this.$http
          .get('/helper/' + this.$route.params.id, {
            params: {
              embeds: 'helper_type_id,warehouse_id',
            },
          })
          .then((response) => {
            this.helper.code = response.data.data.code
            this.helper.username = response.data.data.user.email
            this.helper.phone_number = response.data.data.phone_number
            this.helper.name = response.data.data.name
            this.helper.address = response.data.data.address
            this.helper.password = response.data.data.user.password
            this.helper.confirm_password = response.data.data.user.password
            this.update = true
            this.typeSelected(response.data.data.helper_type)

            this.warehouseSelected(response.data.data.warehouse)

            this.$http.get('/helper/helpertype').then((response) => {
              this.type = []
              let array = response.data.data
              for (let i = 0; i < array.length; i++) {
                this.type.push({
                  type_name: array[i].type_name,
                  id: array[i].id,
                })
              }

              this.$http.get('/warehouse').then((response) => {
                this.warehouse = []
                let array = response.data.data
                for (let i = 0; i < array.length; i++) {
                  this.warehouse.push({
                    warehouse_name: array[i].warehouse_name,
                    id: array[i].id,
                  })
                }
              })
            })
          })
      },
      //menyimpan data update ke dalam API
      save() {
        this.loading = true
        this.$http
          .put('/helper/' + this.$route.params.id, {
            name: this.helper.name,
            type_id: this.type_id,
            address: this.helper.address,
            phone_number: this.helper.phone_number,
            warehouse_id: this.warehouse_id,
            password: this.helper.password,
            confirm_password: this.helper.confirm_password,
          })

          .then((response) => {
            this.$router.push('/helper')
            this.$toast.success('Data has been update successfully')
          })
          .catch((error) => {
            this.loading = false
            this.error = error.response.data.errors
          })
      },
      typeSelected(d) {
        this.types = ''
        this.type_id = ''
        if (d) {
          this.type = d
          this.type_id = d.id
        }
      },
      warehouseSelected(d) {
        this.warehouse_list = ''
        this.warehouse_id = ''
        if (d) {
          this.warehouse_list = d
          this.warehouse_id = d.id
        }
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
    height: 55px;
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
