<template>
  <div class="helper">
    <h2>REPORT PACKING</h2>
    <v-container>
      <v-row no-gutters>
        <v-col md="6">
          <div>
            <v-btn v-model="download" :disabled="downloadDisabled"
              >Download</v-btn
            >
          </div>
        </v-col>
        <v-col md="6" offset="6">
          <div class="search">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              rounded
              label="Search...."
              solo
              hide-details
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <p style="font-size: 20px; margin-top: 40px">Filter</p>
    <v-row>
      <v-col cols="2">
        <template>
          <SelectArea v-model="area" @selected="areaSelected"></SelectArea>
        </template>
      </v-col>

      <v-col cols="2">
        <SelectWarehouse
          :areaId="area"
          v-model="warehouse"
          @selected="warehouseSelected"
          :disabled="warehouseDisabled"
        >
        </SelectWarehouse>
        <!-- <v-autocomplete
          style="border-radius: 15px"
          outlined
          label="Warehouse"
          solo
          item-text="name"
          clearable
          hide-no-data
          hide-selected
        ></v-autocomplete> -->
      </v-col>
      <v-col cols="3">
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
                style="border-radius: 15px"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                clearable
                @click:clear=";(date = ''), renderData(search)"
                :value="format_delivery_date"
                solo
              >
                <template v-slot:label>
                  Delivery Date
                </template>
              </v-text-field>
            </div>
          </template>
          <v-date-picker
            no-title
            v-model="date"
            @input=";(delivery_date_model = false), renderData(search)"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-img
      src="@/assets/download.png"
      style="width: 450px; height: 450px; left: 440px; "
    >
    </v-img>
    <h1 style="margin-left: 478px;">
      Please download to view data
    </h1>
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
        warehouse_id: null,
        warehouseDisabled: true,
        downloadDisabled: true,
        dateDisabled: true,
        areaId: null,
        area: '',
        search: '',
        downloadFile: [],
        group_id: '',
      }
    },

    created() {
      this.renderData()
    },

    watch: {
      // search: {
      //   handler: function(val) {
      //     let that = this
      //     that.renderData(val, this.warehouse)
      //   },
      //   deep: true,
      // },

      warehouse: {
        handler: function(val) {
          this.renderData('', val)
        },
        deep: true,
      },
    },
    computed: {
      format_delivery_date() {
        if (this.date) return this.$moment(this.date).format('DD/MM/YYYY')
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

        // let date = ''
        // if (this.date) {
        //   if (this.warehouse_id) {
        //     date = this.date
        //   } else {
        //     date = +this.date
        //   }
        // } else {
        //   date = ''
        // }

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
          this.warehouse_id = ''
        }

        // this.area = ''
        // this.areaId = ''
        // if (area !== null) {
        //   this.area = area.value
        //   this.warehouseDisabled = false
        // }
        // this.renderData('')
        // if (area == null) {
        //   this.warehouse = ''
        //   this.warehouse_id = ''
        //   this.warehouse = this.warehouseDisabled = true
        //   this.downloadDisabled = true
        // }
        // this.renderData('')
      },
      warehouseSelected(val) {
        this.warehouse_id = null
        if (val) {
          this.warehouse_id = val.value
        }
        this.renderData()
        // this.warehouse = null
        // this.warehouse_id = null
        // this.renderData('')
        // if (val) {
        //   this.warehouse = val.name
        //   this.warehouse_id = val.value
        //   this.downloadDisabled = false
        // } else {
        //   this.downloadDisabled = true
        // }
        // if (warehouse == null) {
        //   this.downloadDisabled = true
        // }
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
  .v-btn:not(.v-btn--round).v-size--default {
    position: absolute;
    width: 200px;
    height: 50px;
    background: #4662d4;
    color: white;
    border-radius: 30px;
    box-sizing: content-box;
    margin-top: 50px;
    text-transform: capitalize;
    cursor: pointer;
    padding: 5px;
  }
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
</style>
