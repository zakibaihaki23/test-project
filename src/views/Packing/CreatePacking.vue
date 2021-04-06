<template>
  <div class="regist">
    <h1>CREATE PACKING</h1>

    <!-- BAGIAN KIRI -->
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
                outlined
                v-model="dateFormatted"
                style="border-radius: 12px;"
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

          <p>Area <span style="color: red">*</span></p>
          <SelectFormArea 
           v-model="area" 
           @selected="areaSelected">
          </SelectFormArea>
        </div>
      </v-col>

      <!-- BAGIAN KANAN -->
      <v-col md="6">
        <div class="form-right">
          <p style="margin-top:177px;">
            Warehouse <span style="color: red">*</span>
          </p>
          <SelectFormWarehouseArea
            v-model="warehouseList"
            @selected="warehouseSelected"
            :areaId="area"
            :disabled="warehouseDisabled"
          >
          </SelectFormWarehouseArea>

        
        </div>
      </v-col>

      <!-- BAGIAN BAWAH -->
      <v-col md="12">
        <p>Note <span style="color: red"></span></p>
        <v-textarea 
        outlined label="Note" 
        style="border-radius: 12px"
        v-model="note" 
        solo> </v-textarea>
      </v-col>
    </v-row>

    <br />
    <br />
    <br />

    <!-- BAGIAN TABEL -->
    <div>
      <v-data-table
        loading-text="Please Wait...."
        :headers="table"
        :items="dataTable"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :search="search"
        @page-count="pageCount = $event"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <pre>{{ props.item.item_name }}</pre>
            </td>
            <td>
              <pre>{{ props.item.uom_name }}</pre>
            </td>
            <!-- <td>{{ props.item.delivery_date | moment('DD/MM/YYYY') }}</td> -->
            <td>
              <pre>{{ props.item.total_order }}</pre>
            </td>
            <td>
              <FormInputPacker v-model="packer" @selected="inputPacker">
              </FormInputPacker>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- BAGIAN NUMBER TABEL -->
    </div>

    <!-- BAGIAN FOOTER -->
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
  import FormInputPacker from '../../components/TabelCreatePacking/FormInputPacker'

  export default {
    components: { SelectFormArea, SelectFormWarehouseArea, FormInputPacker },

    data() {
      return {
        warehouse: '',
        warehouseList: '',
        note: '',
        warehouse_id: null,
        area: '',
        areaId: '',
        packer: '',
        warehouseDisabled: true,
        total_order: '',
        delivery_date: '',
        
        date: new Date(Date.now() + 3600 * 1000 * 24)
          .toISOString()
          .substr(0, 10),
        dateFormatted: new Date(Date.now() + 3600 * 1000 * 24)
          .toISOString()
          .substr(0, 10),
        modal: false,

        // SKRIP TABEL
        page: 1,

        table: [
          {
            text: 'Item',
            align: 'left',
            with: '10%',
            class: ' black--text title',
            sortable: false,
          },
          {
            text: 'UOM',
            align: 'left',
            with: '10%',
            class: '  black--text title',
            sortable: false,
          },
          {
            text: 'Total Order',
            align: 'left',
            with: '10%',
            class: '  black--text title',
            sortable: false,
          },
          {
            text: 'Packer',
            align: 'left',
            with: '10%',
            class: '  black--text title',
            sortable: false,
          },
        ],
      }
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
        let areaId = ''
        if (this.area) {
          areaId = 'city_id.e:' + this.area
        } else {
          areaId = ''
        }

        // RENDER DATA TAMPILAN CREATE PACKABLE
        this.$http
          .get('/packing/item-recap', {
            params: {
              // embeds: 'item_uom_id', 'item_quantity',
              conditions: 'purchaseorder.deliverydate__between:2021-04-02.2021-04-05|purchaseorder.outlet.city.id.e:65536|item.packable:1',
            },
          })
          .then((response) => {
            
            this.dataTable = response.data.data


            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },

      //untuk menyimpan data Penambahan ke dalam API
      save() {
        this.$http
          .post('/packing', {
            area_id: this.area,
            warehouse_id: this.warehouse_id,
            note: this.note,
            total_order: parseInt(this.total_order),
            delivery_date: this.date,
            items: this.dataTable,
          })

          .then((response) => {
            this.$router.push('/packing-order')
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

      warehouseSelected(val) {
        this.warehouseList = null
        this.warehouse_id = null
        if (val) {
          this.warehouseList = val
          this.warehouse_id = val.value
        } 
        this.renderData()
      },

      inputPacker(val) {
        this.packer = ''
        if (val) {
          this.packer = val.id
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
