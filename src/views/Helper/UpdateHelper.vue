<template>
  <div class="regist">
    <h1>UPDATE HELPER</h1>
    <v-row no-gutters>
      <v-col md="6" style="margin-right: 90px">
        <div class="form-right-1">
          <p>Helper ID <span style="color: red">*</span></p>
          <v-text-field disabled v-model="editedItem.code" solo> </v-text-field>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Name <span style="color: red">*</span></p>
          <v-text-field label="Name" v-model="editedItem.name" solo>
          </v-text-field>
          <p>Phone Number*</p>
          <v-text-field label="Phone Number" v-model="editedItem.phone_no" solo>
          </v-text-field>
        </div>
      </v-col>
      <v-col md="6">
        <div class="form-right">
          <p>Type <span style="color: red">*</span></p>
          <v-select
            v-model="types"
            :items="typesValue"
            item-text="type_name"
            item-value="id"
            @selected="typeSelected"
            solo
          >
          </v-select>
          <p>Warehouse <span style="color: red">*</span></p>
          <v-select
            :items="warehouse"
            v-model="warehouse_list"
            item-text="warehouse_name"
            item-value="id"
            @selected="warehouseSelected"
            solo
          >
          </v-select>
        </div>
      </v-col>
      <v-col md="12" style="padding-right: 90px">
        <div>
          <p>Address</p>
          <v-textarea label="Address" v-model="editedItem.address" solo>
          </v-textarea>
        </div>
      </v-col>
    </v-row>

    <h1 style="margin-top: 20px">CREDENTIAL</h1>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Username <span style="color: red">*</span></p>
          <v-text-field v-model="editedItem.email" solo> </v-text-field>
          <p>Password <span style="color: red">*</span></p>
          <v-text-field
            label="Password *"
            solo
            v-model="editedItem.password"
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
            v-model="editedItem.confirm_password"
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
    <div class="btn" v-for="(item, i) in items" :key="i">
      <v-btn
        :to="item.path"
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
        edit: '',
        value: String,
        items: [
          {
            name: 'Help',
            path: '/helper',
          },
        ],
        editedIndex: -1,
        warehouse: '',
        warehouse_list: '',
        warehouse_id: '',
        types: '',
        types_id: '',
        typesValue: [
          {
            type_name: 'Help Picker',
            id: '65536',
          },
          {
            type_name: 'Help Packer',
            id: '131072',
          },
        ],
        editedItem: {
          code: '',
          email: '',
          phone_no: '',
          warehouse_name: '',
          name: '',
          type: '',
          address: '',
          password: '',
          confirm_password: '',
        },
      }
    },
    created() {
      this.renderData()
    },

    methods: {
      //untuk mendapatkan data dari API ke dalam format text-field
      renderData() {
        this.$http
          .get('/user/' + this.$route.params.id, {
            params: {
              embeds: 'helper_type_id,warehouse_id',
            },
          })
          .then((response) => {
            this.editedItem.code = response.data.data.code
            this.editedItem.email = response.data.data.email
            this.editedItem.phone_no = response.data.data.phone_number
            this.editedItem.name = response.data.data.name
            this.editedItem.address = response.data.data.address
            this.editedItem.password = response.data.data.password
            this.editedItem.confirm_password = response.data.data.password
            this.update = true
            this.typeSelected(response.data.data.helper_type)
            this.warehouseSelected(response.data.data.warehouse)

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
      },
      //menyimpan data update ke dalam API
      save() {
        this.$http
          .put('/user/' + this.$route.params.id, {
            name: this.editedItem.name,
            email: this.editedItem.email,
            helper_type_id: this.types_id,
            phone_number: this.editedItem.phone_no,
            warehouse_id: this.warehouse_list.id,
            password: this.editedItem.password,
            confirm_password: this.editedItem.confirm_password,
          })

          .then((response) => {
            this.$router.push('/helper')
            this.$toast.success('Data has been update successfully')
          })
          .catch((error) => {
            this.$toast.error('Field must be filled')
          })
      },
      typeSelected(d) {
        this.types = ''
        this.types_id = ''
        if (d) {
          this.types = d
          this.types_id = d.id
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
  }
  .form-right-1 {
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
  }
  .btn {
    margin-top: 30px;
    padding-left: 1100px;
  }
</style>
