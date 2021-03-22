<template>
  <div class="helper">
    <h2>PACKING LIST</h2>
    <v-container>
      <v-row no-gutters>
        <v-col md="6">
          <div>
            <v-btn :to="{ path: '/packing/create-packing' }"
              >Create Packing</v-btn
            >
          </div>
          <div style="padding-left: 240px">
            <v-btn :to="{ path: '/packing/packing-item' }">Packing Item</v-btn>
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
              append-outer-icon="mdi-format-align-justify"
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <p style="font-size: 20px; margin-top: 25px">Filter</p>
    <v-col md="12">
      <v-divider style="margin-right: 40px"></v-divider>
    </v-col>
    <v-row>
      <v-col cols="2">
        <template>
          <SelectArea v-model="area" @selected="areaSelected"></SelectArea>
        </template>
      </v-col>

      <v-col cols="2">
        <SelectWarehouse
          :areaId="area"
          v-model="warehouseList"
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
        <v-select
          style="border-radius: 15px"
          outlined
          prepend-inner-icon="mdi-calendar"
          label="Delivery Date"
          solo
        ></v-select>
      </v-col>
    </v-row>
    <br />
    <div>
      <v-card>
        <v-data-table
          loading-text="Please Wait...."
          :mobile-breakpoint="0"
          :headers="table"
          :items="dataTable"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          class="elevation-1"
          :search="search"
          @page-count="pageCount = $event"
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.document_code }}</td>
              <td>{{ props.item.warehouse.warehouse_name }}</td>
              <td>{{ props.item.delivery_date | moment('DD/MM/YYYY') }}</td>
              <td>{{ props.item.note }}</td>
              <td>
                <div v-if="props.item.status == 1">
                  {{ 'Done' }}
                </div>
                <div v-else>{{ 'New' }}</div>
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
                        :to="{
                          path: `/helper/update-helper/${props.item.id}`,
                        }"
                        link
                        style="width: 150px; "
                      >
                        <div>
                          <v-list-item-title
                            :to="{ path: '/helper/update-helper' }"
                            link
                            >Input Packing</v-list-item-title
                          >
                        </div>
                      </v-list-item>
                    </template>
                    <v-divider
                      style="margin-left: 10px;margin-right: 10px"
                    ></v-divider>
                    <v-list-item link>
                      <v-list-item-title>
                        <div
                          @click="archive(props.item.id)"
                          v-if="props.item.is_active == 0"
                        >
                          {{ 'Active' }}
                        </div>
                        <div @click="unarchive(props.item.id)" v-else>
                          {{ 'Inactive' }}
                        </div>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </div>
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
        pageCount: 0,
        itemsPerPage: 5,
        warehouseList: '',
        warehouse: '',
        warehouse_id: null,
        warehouseDisabled: true,
        areaId: null,
        area: '',
        search: '',
        table: [
          {
            text: 'Packing Code',
            value: 'document_code',
            align: 'left',
            class: ' black--text title',
          },
          {
            text: 'Warehouse',
            value: 'warehouse_name',
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
      this.initialize(0)
    },
    // watch: {
    //   warehouse: {
    //     handler: function(val) {
    //       let that = this
    //       that.renderData = this.warehouse
    //     },
    //     deep: true,
    //   },
    // },
    methods: {
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
          .get('/v1/warehouse', {
            params: {
              conditions: areaId,
            },
          })
          .then((response) => {})

        let warehouseId = ''
        if (this.warehouse_id) {
          warehouseId = 'warehouse_id.e:' + this.warehouse_id
        } else {
          warehouseId = ''
        }

        this.$http
          .get('/v1/packing', {
            params: {
              orderby: '-id',
              conditions: warehouseId,
            },
          })
          .then((response) => {
            // let that = this;

            this.dataTable = response.data.data

            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      areaSelected(area) {
        this.area = ''
        if (area) {
          this.area = area.value
          this.warehouseDisabled = false
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
        // this.renderData()
      },
    },
  }
</script>

<style scoped>
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
