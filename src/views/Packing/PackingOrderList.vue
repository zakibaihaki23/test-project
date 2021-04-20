<template>
  <div class="helper">
    <h1>PACKING ORDER LIST</h1>
    <v-container>
      <v-row>
        <v-col cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn
              style="margin-top: 50px; background: #4662d4; color: white;  border-radius: 30px; width: 250px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
              :to="{ path: '/packing-order/create' }"
              >Create Packing Order</v-btn
            >
          </div>
        </v-col>
        <v-col>
          <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-bind="attrs"
                  v-on="on"
                  v-model="search"
                  append-icon="mdi-magnify"
                  rounded
                  label="Search...."
                  solo
                  hide-details
                  class="search d-flex d-none d-sm-block"
                >
                </v-text-field>
              </template>
              <span>search by packing order code</span>
            </v-tooltip>
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
      <v-col cols="12" sm="6" md="2">
        <v-menu
          ref="menu"
          v-model="delivery_date_model"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
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
                    @click:clear=";(delivery_date = []), renderData(search)"
                    :value="format_delivery_date"
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
          <v-date-picker no-title range v-model="delivery_date">
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
      <v-col cols="12" md="4" lg="3" xl="2" sm="10">
        <SelectStatus
          v-bind="attrs"
          v-on="on"
          v-model="status"
          @selected="statusSelected"
        >
        </SelectStatus>
      </v-col>
    </v-row>
    <br />
    <div>
      <v-skeleton-loader
        v-if="firstLoad"
        :loading="isLoading"
        type="table"
      ></v-skeleton-loader>
      <v-data-table
        loading-text="Please Wait...."
        :headers="table"
        v-show="!firstLoad"
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
            <td>
              {{ props.item.warehouse.warehouse_code }} -
              {{ props.item.warehouse.warehouse_name }}
            </td>
            <td>{{ props.item.delivery_date | moment('DD/MM/YYYY') }}</td>
            <td>
              <div v-if="props.item.note">
                {{ props.item.note }}
              </div>
              <div v-else>-</div>
            </td>
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
                    <!-- <v-divider
                      style="margin-left: 10px;margin-right: 10px"
                      v-if="props.item.status == 1"
                    ></v-divider>
                    <v-list-item
                      :to="{ path: `/packing-order/update/${props.item.id}` }"
                      link
                      style="width: 150px; "
                      v-if="props.item.status == 1"
                    >
                      <div>
                        <v-list-item-title>Update</v-list-item-title>
                      </div>
                    </v-list-item> -->
                  </template>
                  <v-divider
                    style="margin-left: 10px;margin-right: 10px"
                    v-if="props.item.status == 1"
                  ></v-divider>

                  <v-list-item
                    link
                    v-if="props.item.status == 1"
                    @click="
                      openDialog(props.item.status, props.item.id, 'cancel')
                    "
                  >
                    Cancel
                  </v-list-item>
                  <v-divider
                    v-if="props.item.status == 1"
                    style="margin-left: 10px;margin-right: 10px"
                  ></v-divider>
                  <v-list-item
                    link
                    v-if="props.item.status == 1"
                    @click="
                      openDialog(props.item.status, props.item.id, 'finish')
                    "
                  >
                    Finish
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" persistent max-width="360px">
        <div class="text-center">
          <v-overlay :value="overlay">
            <v-progress-circular
              color="primary"
              indeterminate
              :size="20"
            ></v-progress-circular>
          </v-overlay>
        </div>
        <v-card style="height: 200px">
          <v-card-title class="headline"> </v-card-title>
          <v-card-text
            style="font-size: 16px; margin-top: 10px"
            class="text-center"
            >Are you sure to change this status to<br />
            <b>{{ text }}</b> ?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row>
              <v-col xl="5" cols="6" md="6" sm="6" lg="6">
                <v-btn
                  @click="dialog = false"
                  style="margin-bottom: 20px; margin-top: 5px; background: #4662d4; color: white;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                >
                  No
                </v-btn>
              </v-col>
              <v-col xl="5" cols="6" md="6" sm="6" lg="6">
                <v-btn
                  v-if="text == 'Cancel'"
                  text
                  @click="cancel(idUser, (overlay = !overlay))"
                  style="margin-bottom: 10px; margin-top: 5px; background: white; color: #4662d4; border-style: solid; border-color: #4662d4;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                >
                  Yes
                </v-btn>
                <v-btn
                  v-if="text == 'Finish'"
                  text
                  @click="finish(idUser, (overlay = !overlay))"
                  style="margin-bottom: 10px; margin-top: 5px; background: white; color: #4662d4; border-style: solid; border-color: #4662d4;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                >
                  Yes
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectArea from '../../components/SelectArea'
  import SelectStatus from '../../components/SelectStatusOrder'

  export default {
    components: { SelectWarehouse, SelectArea, SelectStatus },
    data() {
      return {
        dates: '',
        overlay: false,
        dialog: false,
        page: 1,
        warehouseList: '',
        firstLoad: true,
        warehouse: null,
        delivery_date_model: '',
        filterActive: null,
        delivery_date: [
          new Date(Date.now() - 3600 * 1000 * 720).toISOString().substr(0, 10),
          new Date(Date.now() + 3600 * 1000 * 24).toISOString().substr(0, 10),
        ],
        warehouse_id: null,
        warehouseDisabled: true,
        areaId: null,
        isLoading: true,
        loadingBtn: false,
        area: '',
        search: '',
        status: null,
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
        dataTable: [],
      }
    },

    created() {
      this.renderData()
    },
    watch: {
      search: {
        handler: function(val) {
          let that = this
          that.renderData(val)
        },
        deep: true,
      },
      overlay(val) {
        val &&
          setTimeout(() => {
            this.overlay = false
          }, 1000)
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
      openDialog(status, id, action) {
        this.dialog = true
        this.idUser = id
        this.statusUser = status

        if (action == 'cancel') {
          this.text = 'Cancel'
        } else if (action == 'finish') {
          this.text = 'Finish'
        }
      },
      formatDate(val) {
        return moment(val).format('DD-MM-YYYY')
      },

      renderData(search) {
        this.isLoading = true
        this.firstLoad = true
        let areaId = ''
        if (this.area) {
          areaId = 'city_id.e:' + this.area
        } else {
          areaId = ''
        }

        let filterArea = ''
        if (this.area) {
          filterArea = '|warehouse.city.id.e:' + this.area
        }
        if (this.area && this.delivery_date == '') {
          filterArea = 'warehouse.city.id.e:' + this.area
        }

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
        //FILTER AKTIF CANCEL FINISHED
        let isActive = ''
        if (this.filterActive) {
          if (delivery_date || filterArea || warehouseId) {
            isActive = '|status:' + this.filterActive
          } else {
            isActive = 'status:' + this.filterActive
          }
        }

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
          }
          if (this.delivery_date == '') {
            warehouseId = 'warehouse_id.e:' + this.warehouse_id
          }
          if (this.area) {
            warehouseId = '|warehouse_id.e:' + this.warehouse_id
          }
        } else {
          warehouseId = ''
        }

        this.$http
          .get('/packing', {
            params: {
              orderby: '-id,warehouse_id',
              conditions: delivery_date + filterArea + warehouseId + isActive,
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
        setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
          this.isLoading = false
        }, 2000)
      },
      areaSelected(area) {
        this.area = null
        this.areaId = null
        if (area) {
          this.warehouse = null
          this.warehouse_id = null
          this.area = area.value
          this.warehouseDisabled = false
        } else {
          this.warehouseDisabled = true
          this.warehouse = null
          this.warehouse_id = null
        }
        this.renderData('')
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
      statusSelected(status) {
        this.status = ''
        this.filterActive = ''
        if (status) {
          this.status = status
          this.filterActive = status.value
        }
        this.renderData()
      },
      cancel(id) {
        this.firstLoad = true
        this.isLoading = true
        this.overlay = true
        this.$http
          .put('/packing/' + id + '/cancel', {})
          .then((response) => {
            let self = this
            setTimeout(function() {
              self.$toast.success('Packing order cancelled')
              self.dialog = false
              self.renderData()
              self.overlay = false
            }, 1000)
          })
          .catch((error) => {
            this.dialog = false
            this.overlay = false
          })
        setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
          this.isLoading = false
        }, 2000)
      },
      finish(id) {
        this.isLoading = true
        this.firstLoad = true
        this.overlay = true
        this.$http
          .put('/packing/' + id + '/finish', {})
          .then((response) => {
            let self = this
            setTimeout(function() {
              self.$toast.success('Packing order finished')
              self.dialog = false
              self.renderData()
              self.overlay = false
            }, 1000)
          })
          .catch((error) => {
            this.dialog = false
            this.overlay = false
          })
        setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
          this.isLoading = false
        }, 2000)
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
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size: 17px;
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
    width: 150px;
    outline-color: #e8eff2;
  }
  .v-sheet.v-list {
    background: #e8eff2;
  }
</style>
