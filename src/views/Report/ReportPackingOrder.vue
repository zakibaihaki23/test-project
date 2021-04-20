<template>
  <div class="helper">
    <h1>REPORT PACKING</h1>

    <p
      class="d-flex d-none d-sm-block"
      style="font-size: 20px; margin-top: 20px; margin-bottom: 30px"
    >
      Find your document below
    </p>
    <v-divider
      class="d-flex d-none d-sm-block"
      style="margin-right: 40px;"
    ></v-divider>
    <v-col md="12"> </v-col>
    <v-row class="mb-6" style="margin-top: 1px">
      <v-col cols="10" md="4" lg="3" xl="2" sm="6">
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
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-bind="attrs"
                    v-on="on"
                    style="border-radius: 10px; font-size: 13px"
                    prepend-inner-icon="mdi-calendar"
                    outlined
                    single-line
                    clearable
                    dense
                    @click:clear="dateFormatted = ''"
                    v-model="dateFormatted"
                    @blur="date = parseDate(dateFormatted)"
                  >
                    <template v-slot:label>
                      Delivery Date
                    </template>
                  </v-text-field>
                </template>
                <span>Select Delivery Date</span>
              </v-tooltip>
            </div>
          </template>
          <v-date-picker
            no-title
            v-model="date"
            @input="delivery_date_model = false"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3" xl="2" lg="2" sm="10">
        <template>
          <SelectArea v-model="area" @selected="areaSelected"></SelectArea>
        </template>
      </v-col>

      <v-col cols="12" md="4" lg="3" xl="2" sm="10">
        <SelectWarehouse
          :areaId="area"
          v-model="warehouse"
          :warehouse="warehouse"
          @selected="warehouseSelected"
          :disabled="warehouseDisabled"
        >
        </SelectWarehouse>
      </v-col>
      <v-col cols="2" sm="6" md="6" lg="7" xl="2"> </v-col>
      <v-col cols="2" sm="6" md="6" lg="7" xl="2"> </v-col>
      <v-col cols="12" sm="1" md="6" lg="7" xl="2">
        <div>
          <v-dialog v-model="dialog" persistent max-width="1px">
            <div class="text-center">
              <v-overlay :value="overlay">
                <v-progress-circular
                  color="primary"
                  indeterminate
                  :size="20"
                ></v-progress-circular>
              </v-overlay>
            </div>
          </v-dialog>
          <v-btn
            style="bottom: 5px; background: #4662d4; color: white;  border-radius: 30px; width: 250px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
            :disabled="downloadDisabled"
            @click="openDialog"
            >Download</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-flex pb-3 class=" pb-8 text-center" style="margin-top: 100px;">
      <div class="text-center">
        <v-layout justify-center>
          <v-img class="gbr" src="@/assets/download.png"> </v-img>
        </v-layout>
        <div style="margin-top: 400px; font-size: 20px">
          Please download to view data
        </div>
      </div>
    </v-flex>
  </div>
</template>

<script>
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectArea from '../../components/SelectArea'
  export default {
    components: { SelectWarehouse, SelectArea },
    data() {
      return {
        dialog: false,
        page: 1,
        warehouseList: '',
        warehouse: null,
        delivery_date_model: '',
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: '',
        delivery_date_model: '',
        delivery_date: '',
        warehouse_id: null,
        warehouseDisabled: true,
        btnLoading: false,
        dateDisabled: true,
        downloadDisabled: true,
        areaId: null,
        area: '',
        search: '',
        group_id: '',
        archived: null,
      }
    },

    created() {
      this.renderData()
    },

    watch: {
      warehouse: {
        handler: function(val) {
          this.renderData('', val)
        },
        deep: true,
      },
      overlay(val) {
        val &&
          setTimeout(() => {
            this.overlay = false
          }, 1000)
      },
      date(val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    },
    computed: {
      format_delivery_date() {
        if (this.delivery_date)
          return this.$moment(this.delivery_date).format('DD/MM/YYYY')
      },
    },
    methods: {
      formatDate(date) {
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate(date) {
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      openDialog() {
        this.dialog = true
        this.overlay = true
        this.downloadFile()
      },
      formatDate(val) {
        return this.$moment(val).format('DD/MM/YYYY')
      },
      initialize() {
        this.dataTable = [this.dataTable]
      },
      renderData() {
        let areaId = ''
        if (this.area) {
          areaId = 'city_id.e:' + this.area
        } else {
          areaId = ''
        }

        this.$http
          .get('/warehouse', {
            params: {
              conditions: areaId,
            },
          })
          .then((response) => {})
      },
      areaSelected(area) {
        this.area = null
        this.areaId = null
        if (area) {
          this.area = area.value
          this.warehouseDisabled = false
        } else {
          this.warehouseDisabled = true
          this.warehouse = null
          this.warehouse_id = null
          this.downloadDisabled = true
        }
      },
      warehouseSelected(val) {
        this.warehouse = null
        this.warehouse_id = null
        if (val) {
          this.warehouse = val
          this.warehouse_id = val.value
          this.downloadDisabled = false
        } else {
          this.downloadDisabled = true
        }
        this.renderData('')
      },
      downloadFile() {
        let updatedate = this.$moment(this.date)
          .add(7)
          .format('YYYY-MM-DD')

        this.$http
          .get('/packing/packing-report', {
            params: {
              export: 1,
              conditions:
                'delivery_date:' +
                updatedate +
                'T00:00:00+07:00' +
                '|warehouse_id.e:' +
                this.warehouse_id +
                '|area_id.e:' +
                this.area,
            },
          })
          .then((response) => {
            let self = this
            setTimeout(function() {
              self.dialog = false
              window.location.href = response.data.file
            }, 1000)
          })
          .catch((error) => {
            this.dialog = false
          })
      },
    },
  }
</script>

<style scoped>
  .mytable table tr {
    border: none;
  }
  .helper {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding-left: 80px;
    padding-right: 50px;
  }
  /* .v-btn:not(.v-btn--round).v-size--default {
    position: absolute;
    width: 200px;
    height: 50px;
    background: #4662d4;
    color: white;
    border-radius: 30px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 50px;
    text-transform: capitalize;
    cursor: pointer;
    padding: 5px;
  } */
  .search {
    padding-left: 100px;
    padding-right: 50px;

    margin-top: 50px;
  }
  thead {
    border-radius: 60px;
  }
  /* .mytable .v-table tbody tr:not(:last-child) {
    border-bottom: none;
    background: brown;
  } */
  .v-data-table-header thead {
    background: red;
  }
  .v-menu__content {
    border-radius: 8px;
    border: 1px solid #c4c4c4;
    outline-style: inherit;
    outline-color: white;
    box-shadow: none;

    outline-color: #e8eff2;
  }
  .v-sheet.v-list {
    background: #e8eff2;
  }
  .gbr {
    position: absolute;
    bottom: 150px;
  }
</style>
