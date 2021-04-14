<template>
  <div class="regist">
    <h1>CREATE PACKING</h1>

    <!-- BAGIAN KIRI -->
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <p>Delivery Date <span style="color: red">*</span></p>
          <v-menu
            ref="menu"
            v-model="delivery_date_model"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-text-field
                  style="border-radius: 12px;"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  single-line
                  clearable
                  @click:clear="delivery_date = ''"
                  :value="format_delivery_date"
                  class="rounded-form"
                >
                  <template v-slot:label>
                    Delivery Date
                  </template>
                </v-text-field>
              </div>
            </template>
            <v-date-picker no-title v-model="delivery_date">
              <v-btn
                text
                color="primary"
                style="margin-left: 130px"
                @click="delivery_date_model = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                style="margin-left: 10px"
                color="primary"
                @click="delivery_date_model = false"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <!-- <v-dialog
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
                single-line
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
          </v-dialog> -->

          <p>Area <span style="color: red">*</span></p>
          <SelectFormArea v-model="area" @selected="areaSelected">
          </SelectFormArea>
        </div>
      </v-col>

      <!-- BAGIAN KANAN -->
      <v-col md="6">
        <div class="form-left">
          <p style="margin-top:177px;">
            Warehouse <span style="color: red">*</span>
          </p>

          <SelectFormWarehouseArea
            v-model="warehouse"
            @selected="warehouseSelected"
            :areaId="area"
            :warehouse="warehouse"
            :disabled="warehouseDisabled"
          >
          </SelectFormWarehouseArea>
        </div>
      </v-col>

      <!-- BAGIAN BAWAH -->
      <v-col md="12">
        <p>Note <span style="color: red"></span></p>
        <v-textarea
          outlined
          label="Note"
          style="border-radius: 12px"
          v-model="note"
          single-line
        >
        </v-textarea>
      </v-col>

      <!-- <pre>{{dataTable}}</pre> -->
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
              <FormInputPacker
                v-model="packer"
                :warehouse_id="warehouse.value"
                @click.native="sendIdx(props.index)"
                @selected="inputPacker"
              >
              </FormInputPacker>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <!-- BAGIAN FOOTER -->
    <pre>{{ this.packer }}</pre>
    <br /><br />
    <br />
    <v-divider></v-divider>
    <div class="btn">
      <v-btn
        :to="{ path: '/packing-order' }"
        color="#E6E9ED"
        style="margin: 10px; color: #768F9C; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px;"
        class="cancel"
        link
        >Cancel</v-btn
      >
      <v-btn
        style="margin: 10px; background: #4662d4; color: white; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
        class="save"
        @click="save"
        :loading="loading"
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
        warehouse: null,
        warehouseList: null,
        note: '',
        warehouse_id: null,
        area: '',
        areaId: null,
        packer: '',
        warehouseDisabled: true,
        total_order: '',
        delivery_date: '',
        delivery_date_model: '',
        dataTable: [],
        idx: '',
        items: [],
        loading: false,

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
            width: '40%',
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
            width: '40%',
            class: '  black--text title',
            sortable: false,
          },
        ],
      }
    },

    computed: {
      computedDateFormatted() {
        return this.formatDate(this.delivery_date)
      },
      format_delivery_date() {
        if (this.delivery_date)
          return this.$moment(this.delivery_date).format('DD/MM/YYYY')
      },
    },

    watch: {
      date(val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    },

    methods: {
      sendIdx(id) {
        this.idx = id
      },
      inputPacker(val) {
        this.dataTable[this.idx].helper = []
        if (val) {
          this.dataTable[this.idx].helper = val
        }
      },
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
        let updatedate = this.$moment(this.date)
          .add(7)
          .format('YYYY-MM-DD')

        // RENDER DATA TAMPILAN CREATE PACKABLE
        this.$http
          .get('/packing/item-recap', {
            params: {
              // embeds: 'item_uom_id', 'item_quantity',
              conditions:
                'purchaseorder.deliverydate:' + updatedate + 'T07:00:00+07:00',
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
        this.loading = true
        var items = []
        for (let i = 0; i < this.dataTable.length; i++) {
          items[i] = {
            item_id: this.dataTable[i].id,
          }
        }
        this.$http
          .post('/packing', {
            area_id: this.area,
            warehouse_id: this.warehouse_id,
            note: this.note,
            total_order: parseInt(this.total_order),
            delivery_date: this.delivery_date,
            items: this.dataTable,
          })

          .then((response) => {
            this.$router.push('/packing-order')
            this.$toast.success('Data has been saved successfully')
          })
          .catch((error) => {
            this.error = error.response.data.errors
            this.$toast.error(error.response.data.errors.area_id)
            this.$toast.error(error.response.data.errors.warehouse_id)
            if (error.response.data.errors.id)
              this.$toast.error(error.response.data.errors.id)
            this.loading = false
            console.log(this.error)
          })
      },
      areaSelected(area) {
        this.area = null
        this.areaId = null
        this.dataTable = []
        if (area) {
          this.area = area.id
          this.warehouseDisabled = false
        } else {
          this.warehouseDisabled = true
          this.warehouse = null
          this.warehouse_id = null
        }
        //
        // this.renderData()
      },

      warehouseSelected(val) {
        this.warehouse = null
        this.warehouse_id = null
        this.dataTable = []
        if (val) {
          this.warehouse = val
          this.warehouse_id = val.value
        }
        this.renderData('')
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
  .form-left {
    margin-top: 0px;
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
