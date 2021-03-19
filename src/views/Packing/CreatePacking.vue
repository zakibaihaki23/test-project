<template>
  <div class="regist">
    <h1>CREATE PACKING</h1>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Delivery Date <span style="color: red">*</span></p>
          <v-text-field
            prepend-inner-icon="mdi-calendar"
            label="Delivery Date *"
            solo
            readonly
          >
          </v-text-field>

          <p>Warehouse <span style="color: red">*</span></p>
          <SelectAreaWarehouse
            v-model="warehouse"
            @selected="warehouseSelected"
          >
          </SelectAreaWarehouse>
          <!-- <v-select
            :items="warehouse"
            item-text="name"
            item-value="value"
            label="Warehouse *"
            solo
            v-model="warehouseList"
          >
          </v-select> -->
        </div>
      </v-col>
      <v-col md="6">
        <div class="form-right">
          <p>Area <span style="color: red">*</span></p>
          <SelectArea v-model="area" @selected="areaSelected"> </SelectArea>
          <!-- <v-select
            label="Area *"
            :items="area"
            v-model="areaList"
            item-value="value"
            solo
            item-text="name"
          >
          </v-select> -->
          <p>Note <span style="color: red">*</span></p>
          <v-textarea label="Note *" solo> </v-textarea>
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
        :to="{ path: '/packing' }"
        color="#E6E9ED"
        style="margin: 10px; color: #768F9C"
        class="cancel"
        link
        >Cancel</v-btn
      >
      <v-btn style="margin: 10px;" class="save" @click="save">Save</v-btn>
    </div>
  </div>
</template>

<script>
  import SelectArea from '../../components/SelectArea'
  import SelectAreaWarehouse from '../../components/SelectAreaWarehouse'
  export default {
    components: { SelectArea, SelectAreaWarehouse },
    data() {
      return {
        warehouse: '',
        warehouseList: '',
        warehouse_id: null,
        area: null,
        areaId: null,
      }
    },
    created() {
      this.renderData()
    },
    methods: {
      renderData() {
        this.$http.get('/v1/city').then((response) => {
          this.area = []
          let array = response.data.data
          for (let i = 0; i < array.length; i++) {
            this.area.push({
              name: array[i].city_name,
              value: array[i].id,
            })
          }
        })
        let warehouseId = ''
        if (this.warehouse_id) {
          warehouseId = 'city_id.e:' + this.warehouse_id
        } else {
          warehouseId = ''
        }

        this.$http
          .get('/v1/warehouse', {
            params: {
              conditions: warehouseId,
            },
          })
          .then((response) => {
            // this.warehouse = []
            // let array = response.data.data
            // for (let i = 0; i < array.length; i++) {
            //   this.warehouse.push({
            //     name: array[i].warehouse_name,
            //     value: array[i].id,
            //   })
            //   console.log(this.warehouse)
            // }
          })
      },
      save() {
        this.$http.post('/v1/packing', {
          warehouse_id: this.warehouseList,
        })
      },
      areaSelected(area) {
        this.area = ''
        if (area) {
          this.area = area.value
        }
        this.renderData()
      },
      warehouseSelected(warehouse) {
        this.warehouse = ''
        this.warehouse_id = ''
        if (warehouse) {
          this.warehouse = warehouse
          this.warehouse_id = warehouse.value
        }
        this.renderData()
        console.log(this.warehouse_id)
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
  }
  .btn {
    margin-top: 30px;
    padding-left: 1100px;
  }
</style>
