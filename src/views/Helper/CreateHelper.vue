<template>
  <div class="regist">
    <h1>CREATE HELPER</h1>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Name <span style="color: red">*</span></p>
          <v-text-field
            single-line
            label="Name *"
            outlined
            class="form"
            v-model="helper.name"
          >
          </v-text-field>

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
          >
          </v-select>
        </div>
      </v-col>
      <v-col md="6">
        <div class="form-right">
          <p>Phone Number <span style="color: red">*</span></p>
          <v-text-field
            v-model="helper.phone_number"
            label="Phone Number *"
            outlined
            class="form"
            single-line
          >
          </v-text-field>
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
          >
          </v-autocomplete>
        </div>
      </v-col>
      <v-col md="12" style="padding-right: 90px">
        <p>Address</p>
        <v-textarea
          v-model="helper.address"
          outlined
          single-line
          class="form"
          label="Address"
        >
        </v-textarea>
      </v-col>
    </v-row>

    <h1 style="margin-top: 20px">CREDENTIAL</h1>
    <v-row no-gutters>
      <v-col md="6" class="form-right" style="margin-top: 20px">
        <p>Username <span style="color: red">*</span></p>
        <v-text-field
          label="Username *"
          outlined
          single-line
          class="form"
          v-model="helper.username"
        >
        </v-text-field>
      </v-col>
      <v-col md="6" style="margin-top: 5px"> </v-col>
      <v-col md="6" class="form-right" style="margin-top: 5px">
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
        >
        </v-text-field>
      </v-col>
      <v-col md="6" class="form-right" style="margin-top: 5px">
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
        >
        </v-text-field>
      </v-col>
    </v-row>
    <br />
    <br /><br />
    <br /><br />
    <br /><br />
    <br /><br />
    <br />
    <v-divider></v-divider>
    <div class="btn">
      <v-col class="text-right">
        <v-btn
          :to="{ path: '/helper' }"
          color="#E6E9ED"
          style="margin: 10px; color: #768F9C"
          class="cancel"
          >Cancel</v-btn
        >
        <v-btn
          style="margin: 10px;"
          class="save"
          @click="save"
          v-if="
            helper.name &&
              helper.address &&
              helper.phone_number &&
              helper.password &&
              helper.confirm_password &&
              helper.username
          "
          >Save</v-btn
        >
        <v-btn
          v-else
          :disabled="saveDisabled"
          style="margin: 10px;"
          class="save"
          >Save</v-btn
        >
      </v-col>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        saveDisabled: true,
        helper: {
          name: '',
          address: '',
          phone_number: '',
          password: '',
          confirm_password: '',
          username: '',
        },
        value: String,
        warehouse: '',
        warehouse_id: '',
        type_id: '',
        types: '',
      }
    },
    created() {
      this.renderData()
    },

    methods: {
      //untuk mendapatkan list warehouse dari API
      renderData() {
        this.$http.get('/warehouse').then((response) => {
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
            this.$toast.error('Field must be filled')
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
    margin-top: 50px;
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
