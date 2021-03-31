<template>
  <div class="regist">
    <h1>CREATE HELPER</h1>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Name <span style="color: red">*</span></p>
          <v-text-field label="Name *" solo v-model="helper.name">
          </v-text-field>

          <p>Type <span style="color: red">*</span></p>
          <v-select
            label="Type *"
            solo
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
            solo
          >
          </v-text-field>
          <p>Warehouse <span style="color: red">*</span></p>
          <v-autocomplete
            clearable
            :items="warehouse"
            item-text="name"
            item-value="value"
            label="Warehouse *"
            solo
            v-model="warehouse_id"
          >
          </v-autocomplete>
        </div>
      </v-col>
      <v-col md="12" style="padding-right: 90px">
        <p>Address</p>
        <v-textarea v-model="helper.address" label="Address" solo> </v-textarea>
      </v-col>
    </v-row>

    <h1 style="margin-top: 20px">CREDENTIAL</h1>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Username <span style="color: red">*</span></p>
          <v-text-field label="Username *" solo v-model="helper.username">
          </v-text-field>
          <p>Password <span style="color: red">*</span></p>
          <v-text-field
            label="Password *"
            solo
            v-model="helper.password"
            :type="value ? 'password' : 'text'"
            :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (value = !value)"
          >
          </v-text-field>
        </div>
      </v-col>
      <v-col md="6">
        <div class="form-right">
          <p style="padding-top: 118px">
            Confirm Password <span style="color: red">*</span>
          </p>
          <v-text-field
            label="Confirm Password *"
            solo
            v-model="helper.confirm_password"
            :type="value ? 'password' : 'text'"
            :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (value = !value)"
          >
          </v-text-field>
        </div>
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
      <v-btn
        :to="{ path: '/helper' }"
        color="#E6E9ED"
        style="margin: 10px; color: #768F9C"
        class="cancel"
        >Cancel</v-btn
      >
      <v-btn style="margin: 10px;" class="save" @click="save">Save</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
    padding-left: 1100px;
  }
</style>
