<template>
  <div class="regist">
    <h1>CREATE PACKING</h1>
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Delivery Date <span style="color: red">*</span></p>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            :close-on-content-click="false"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                label="Delivery Date *"
                prepend-inner-icon="mdi-calendar"
                v-on="on"
                v-bind="attrs"
                readonly
                solo
              >
              </v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-btn
                text
                color="primary"
                style="margin-left: 130px"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                style="margin-left: 10px"
                color="primary"
                @click="$refs.dialog.save(date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <p>Warehouse <span style="color: red">*</span></p>
          <SelectFormWarehouseArea
            v-model="warehouseList"
            @selected="warehouseSelected"
            :areaId="area"
            :disabled="warehouseDisabled"
          >
          </SelectFormWarehouseArea>
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
          <SelectFormArea v-model="area" @selected="areaSelected">
          </SelectFormArea>
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
          <v-textarea label="Note *" v-model="note" solo> </v-textarea>
          <p>Total Order <span style="color: red">*</span></p>
          <v-text-field label="Total Order *" v-model="total_order" solo>
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
        :to="{ path: '/packing' }"
        color="#E6E9ED"
        style="margin: 10px; color: #768F9C; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
        class="cancel"
        link
        >Cancel</v-btn
      >
      <v-btn
        style="margin: 10px; background: #4662d4; color: white; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
        class="save"
        @click="save"
        >Save</v-btn
      >
    </div>
  </div>
</template>

<script>
  import SelectFormArea from '../../components/SelectFormArea'
  import SelectFormWarehouseArea from '../../components/SelectFormWarehouseArea'
  export default {
    components: { SelectFormArea, SelectFormWarehouseArea },
    data() {
      return {
        warehouse: '',
        warehouseList: '',
        note: '',
        warehouse_id: null,
        area: '',
        areaId: null,
        warehouseDisabled: true,
        total_order: '',
        delivery_date: '',
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: '',
        modal: false,
      }
    },
    created() {
      this.renderData()
    },
    computed: {
      computedDateFormatted() {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date(val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    },
    methods: {
      formatDate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate(date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      renderData() {
        // this.$http.get('/v1/city').then((response) => {
        //   this.area = []
        //   let array = response.data.data
        //   for (let i = 0; i < array.length; i++) {
        //     this.area.push({
        //       name: array[i].city_name,
        //       value: array[i].id,
        //     })
        //   }
        // })
        let areaId = ''
        if (this.area) {
          areaId = 'city_id.e:' + this.area
        } else {
          areaId = ''
        }

        this.$http
          .get('/v1/warehouse', {
            params: {
              conditions: areaId,
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
        this.$http
          .post('/v1/packing', {
            warehouse_id: this.warehouse_id,
            note: this.note,
            total_order: parseInt(this.total_order),
            delivery_date: this.date,
          })

          .then((response) => {
            this.$router.push('/packing')
            this.$toast.success('Data has been saved successfully')
          })
      },

      areaSelected(val) {
        this.area = ''
        if (val) {
          this.area = val.id
          this.warehouseDisabled = false
        }
        this.renderData()
      },
      warehouseSelected(warehouse) {
        this.warehouse = ''
        this.warehouse_id = ''
        if (warehouse) {
          //   this.warehouse = d
          this.warehouse_id = warehouse.value
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
    margin-top: 50px;
    padding-right: 90px;
  }
  .name {
    border-radius: 15px;
  }
  /* .cancel {
    margin-top: 50px;
    background: #4662d4;
    color: white;
    box-sizing: content-box;
    border-radius: 25px;
    width: 111px;
    height: 45px;
  } */

  .btn {
    margin-top: 30px;
    padding-left: 1100px;
  }
</style>
