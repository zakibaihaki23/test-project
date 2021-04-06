<template>
  <div class="helper">
    <h2>PACKING ORDER LIST</h2>
    <v-container>
      <v-row>
        <v-col cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn
              style="margin-top: 50px; background: #4662d4; color: white;  border-radius: 25px; width: 191px; height: 50px; padding: 4px; font-size: 13px; text-transform: capitalize;"
              :to="{ path: '/packing-order/create' }"
              >Create Packing Order</v-btn
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
      style="font-size: 25px; margin-top: 40px"
    >
      Filter
    </p>
    <v-divider
      class="d-flex d-none d-sm-block"
      style="margin-right: 40px;"
    ></v-divider>
    <v-col md="12"> </v-col>
    <v-row style="margin-top: 1px">
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
      <v-col cols="12" md="5" lg="5" xl="4" sm="10">
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
                single-line
                clearable
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
    </v-row>
    <br />
    <div>
      <v-data-table
        loading-text="Please Wait...."
        :headers="table"
        :items="dataTable"
        :page.sync="page"
        :items-per-page="20"
        :search="search"
        @page-count="pageCount = $event"
        :loading="isLoading"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.document_code }}</td>
            <td>{{ props.item.warehouse.warehouse_name }}</td>
            <td>{{ props.item.delivery_date | moment('DD/MM/YYYY') }}</td>
            <td>{{ props.item.note }}</td>
            <td>
              <div v-if="props.item.status == 1">
                {{ 'Active' }}
              </div>
              <div v-if="props.item.status === 2">{{ 'Finished' }}</div>
              <div v-if="props.item.status === 3">{{ 'Cancelled' }}</div>
            </td>
            <td>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon dark>
                      mdi-dots-horizontal
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <template class="menu">
                    <v-list-item
                      :to="{ path: `/packing-order/${props.item.id}` }"
                      link
                    >
                      <div>
                        <v-list-item-title>Detail</v-list-item-title>
                      </div>
                    </v-list-item>
                    <v-divider
                      style="margin-left: 10px;margin-right: 10px"
                    ></v-divider>
                    <v-list-item
                      :to="{ path: `/packing-order/update/${props.item.id}` }"
                      link
                      style="width: 150px; "
                    >
                      <div>
                        <v-list-item-title>Update</v-list-item-title>
                      </div>
                    </v-list-item>
                  </template>
                  <v-divider
                    style="margin-left: 10px;margin-right: 10px"
                  ></v-divider>
                  <v-list-item link>
                    <v-list-item-title>
                      Cancel
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider
                    style="margin-left: 10px;margin-right: 10px"
                  ></v-divider>
                  <v-list-item link>
                    <v-list-item-title>
                      <div
                        @click="archive(props.item.id)"
                        v-if="props.item.status == 1"
                      >
                        {{ 'Finish' }}
                      </div>
                      <div @click="unarchive(props.item.id)" v-else>
                        {{ 'Unfinished' }}
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectArea from '../../components/SelectArea'
  export default {
    components: { SelectWarehouse, SelectArea },
    data() {
      return {
        dates: '',
        page: 1,
        warehouseList: '',
        warehouse: null,
        delivery_date_model: '',
        delivery_date: '',
        warehouse_id: null,
        warehouseDisabled: true,
        areaId: null,
        isLoading: true,
        area: '',
        search: '',
        table: [
          {
            text: 'Packing Order Code',
            value: 'document_code',
            align: 'left',
            class: ' black--text title',
          },
          {
            text: 'Warehouse',
            value: 'warehouse.warehouse_name',
            align: 'left',
            class: '  black--text title',
          },
          {
            text: 'Delivery Date',
            value: 'delivery_date',
            class: 'black--text title',
          },
          {
            text: 'Note',
            value: 'note',
            class: 'black--text title',
          },

          {
            text: 'Status',
            value: 'status',
            class: 'black--text title',
          },
          {
            value: 'actions',
            sortable: false,
          },
        ],
        dataTable: {
          warehouse: {
            warehouse_name: '',
          },
        },
        total: [],
      }
    },

    created() {
      this.renderData()
      this.initialize(0)
    },
    watch: {
      search: {
        handler: function(val) {
          let that = this
          that.renderData(val)
        },
        deep: true,
      },
    },
    computed: {
      // format_delivery_date() {
      //   if (this.delivery_date)
      //     return this.$moment(this.delivery_date).format('DD/MM/YYYY')
      // },
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
      dateRangeText() {
        return this.dates.join(' ~ ')
      },
    },
    methods: {
      formatDate(val) {
        return moment(val).format('DD-MM-YYYY')
      },
      initialize() {
        this.dataTable = [this.dataTable]
        this.total = [this.total]
      },
      renderData(search) {
        let areaId = ''
        if (this.area) {
          areaId = 'city_id.e:' + this.area
        } else {
          areaId = ''
        }

        // let delivery_date = ''
        // if (this.delivery_date) {
        //   if (this.warehouse_id) {
        //     delivery_date = '|deliverydate__between:' + this.delivery_date
        //   } else {
        //     delivery_date = '|deliverydate__between:' + this.delivery_date
        //   }
        // } else {
        //   delivery_date = ''
        // }
        let delivery_date = ''
        if (this.delivery_date.length > 0) {
          if (this.delivery_date.length == 1) {
            delivery_date = 'delivery_date:' + this.delivery_date[0]
          } else {
            let date = this.delivery_date[0]
            let date2 = this.delivery_date[1]
            if (date > date2) {
              delivery_date = 'deliverydate__between:' + date2 + '.' + date
            } else {
              delivery_date = 'deliverydate__between:' + date + '.' + date2
            }
          }
        }

        // let dates = ''
        // if (this.dates) {
        //   if (this.warehouse_id) {
        //     dates = '|delivery_date:' + this.dates
        //   } else {
        //     dates = 'delivery_date:' + this.dates
        //   }
        // } else {
        //   dates = ''
        // }

        this.$http
          .get('/warehouse', {
            params: {
              conditions: areaId,
            },
          })
          .then((response) => {})

        let warehouseId = ''
        if (this.warehouse_id) {
          if (this.delivery_date) {
            warehouseId = '|warehouse_id.e:' + this.warehouse_id
          } else {
            warehouseId = 'warehouse_id.e:' + this.warehouse_id
          }
        } else {
          warehouseId = ''
        }

        this.$http
          .get('/packing', {
            params: {
              orderby: '-id,warehouse_id',
              conditions: delivery_date + warehouseId,
            },
          })
          .then((response) => {
            // let that = this;

            this.dataTable = response.data.data
            this.total = response.data.total
            this.isLoading = false

            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
          .catch((error) => {
            console.log(error)
          })
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
        }
        this.renderData()
        // this.area = null
        // this.areaId = null
        // this.warehouse_id = null
        // this.warehouse = null
        // if (area) {
        //   this.area = area.value
        //   this.warehouseDisabled = false
        // } else {
        //   this.warehouseDisabled = true
        //   this.warehouse = null
        //   this.warehouse_id = null
        //   console.log('tes 2')
        // }
        // this.renderData()
        // if (area === null) {
        //   this.warehouse = ''
        //   this.warehouse_id = ''
        //   this.warehouse = this.warehouseDisabled = true
        // }
      },
      warehouseSelected(val) {
        this.warehouse = null
        this.warehouse_id = null
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
  .mx-input {
    height: 600px !important;
  }
  .mytable table tr {
    border: none;
  }
  .helper {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding-left: 80px;
    padding-right: 50px;
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
