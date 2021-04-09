<template>
  <div class="helper">
    <h1>REPORT PACKING</h1>
    <v-container>
      <v-row>
        <v-col cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn
              style="margin-top: 50px; background: #4662d4; color: white;  border-radius: 30px; width: 250px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
              v-model="download"
              :disabled="downloadDisabled"
              >Download</v-btn
            >
          </div>
        </v-col>
        <v-col>
          <div>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              rounded
              label="Search...."
              solo
              hide-details
              class="search d-flex d-none d-sm-block"
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <p
      class="d-flex d-none d-sm-block"
      style="font-size: 20px; margin-top: 40px"
    >
      Filter
    </p>
    <v-divider
      class="d-flex d-none d-sm-block"
      style="margin-right: 40px;"
    ></v-divider>
    <v-col md="12"> </v-col>
    <v-row style="margin-top: 1px">
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
              <v-text-field
                style="border-radius: 10px; font-size: 13px"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                single-line
                clearable
                dense
                @click:clear=";(delivery_date = []), renderData(search)"
                :value="format_delivery_date"
              >
                <template v-slot:label>
                  Delivery Date
                </template>
              </v-text-field>
            </div>
          </template>
          <v-date-picker scrollable no-title range v-model="delivery_date">
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click=";(delivery_date_model = false), renderData(search)"
            >
              OK
            </v-btn>
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
    </v-row>
    <v-flex
      pb-3
      class=" pb-8 text-center"
      style="margin-top: 300px;"
      v-show="!downloadDisabled"
    >
      <div class="text-center pb-4">
        <v-layout justify-center>
          <v-img class="gbr" src="@/assets/download.png"> </v-img>
        </v-layout>
        <h1 style="margin-top: 160px;">
          Please download to view data
        </h1>
      </div>
    </v-flex>
    <v-flex
      shrink
      class=" pb-8 text-center"
      style="margin-top: 300px;"
      v-show="downloadDisabled"
    >
      <div class="text-center pb-4">
        <v-layout justify-center>
          <v-img class="gbr" src="@/assets/download1.png"> </v-img>
        </v-layout>
        <h1 style="margin-top: 160px;">
          Please download to display
        </h1>
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
        page: 1,
        warehouseList: '',
        warehouse: null,
        delivery_date_model: '',
        date: '',
        delivery_date_model: '',
        delivery_date: '',
        warehouse_id: null,
        warehouseDisabled: true,
        downloadDisabled: true,
        dateDisabled: true,
        areaId: null,
        area: '',
        search: '',
        downloadFile: [],
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
    },
    computed: {
      format_delivery_date() {
        if (this.delivery_date.length > 0) {
          let ret = ''
          if (this.delivery_date.length == 1) {
            let date = this.delivery_date[0]
            ret = this.$moment(date).format('DD/MM/YYYY')
          } else {
            let date = this.delivery_date[0]
            let date2 = this.delivery_date[1]
            if (date > date2) {
              ret =
                this.$moment(date2).format('DD/MM/YYYY') +
                '-' +
                this.$moment(date).format('DD/MM/YYYY')
            } else {
              ret =
                this.$moment(date).format('DD/MM/YYYY') +
                '-' +
                this.$moment(date2).format('DD/MM/YYYY')
            }
          }
          return ret
        }
      },
    },
    methods: {
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

        // let warehouseId = ''
        // if (this.warehouse_id) {
        //   warehouseId = 'warehouse_id.e:' + this.warehouse_id
        // } else {
        //   warehouseId = ''
        // }

        // let groupId = ''
        // if (this.warehouse_id) {
        //   groupId = '|group_id.e:' + this.warehouse_id
        // } else {
        //   groupId = ''
        // }

        // this.$http
        //   .get('/report/group-log', {
        //     params: {
        //       export: '1',
        //       date,
        //       conditions: warehouseId + groupId,
        //     },
        //   })
        //   .then((response) => {
        //     this.downloadFile = response.data.file

        //     if (this.downloadFile === null) {
        //       this.downloadFile = []
        //     }
        //   })
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
    bottom: 100px;
  }
</style>
