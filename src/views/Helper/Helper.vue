<template>
  <div class="helper">
    <h2>HELPER LIST</h2>
    <v-container>
      <v-row no-gutters>
        <v-col md="6">
          <div>
            <v-btn :to="{ path: '/helper/create-helper' }">Create Helper</v-btn>
          </div>
        </v-col>
        <v-col md="6" offset="5">
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
        <v-col>
          <!-- <v-menu offset-y>
            <template
              v-slot:activator="{ on, attrs }"
              style="text-align: center"
            >
              <v-btn
                style="background: #4662D4; color: white; border-radius: 50%; cursor: pointer; top: 55px; margin-right: 50px; right: 35px"
                fab
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-format-align-justify
                </v-icon>
              </v-btn>
            </template>
            <template class="menu">
              <v-checkbox
                dense
                light
                multiple
                v-model="selected"
                label="John"
                value="John"
                style="width: 100px"
              ></v-checkbox>
            </template>
          </v-menu> -->
        </v-col>
      </v-row>
    </v-container>
    <p style="font-size: 20px; margin-top: 25px">Filter</p>
    <v-col md="12">
      <v-divider style="margin-right: 40px"></v-divider>
    </v-col>
    <v-row>
      <v-col cols="2">
        <SelectStatus v-model="status" @selected="statusSelected">
        </SelectStatus>
        <!-- <v-autocomplete
          style="border-radius: 15px"
          outlined
          label="Status"
          solo
          clearable
          :items="status"
          item-value="value"
          item-text="text"
        >
        </v-autocomplete> -->
      </v-col>
      <v-col cols="3">
        <SelectWarehouse v-model="warehouse" @selected="warehouseSelected">
        </SelectWarehouse>
        <!-- <v-autocomplete
          style="border-radius: 15px"
          outlined
          label="Warehouse"
          solo
          :items="warehouse"
          item-text="name"
          item-value="id"
          clearable
          hide-no-data
          hide-selected
        ></v-autocomplete> -->
      </v-col>
    </v-row>
    <br />
    <div>
      <v-data-table
        loading-text="Please Wait...."
        :headers="table"
        :items="dataTable"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :search="search"
        @page-count="pageCount = $event"
        hide-default-footer
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.code }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone_number }}</td>
            <td>{{ props.item.address }}</td>
            <td>{{ props.item.helper_type.type_name }}</td>

            <td>{{ props.item.warehouse.warehouse_name }}</td>

            <td>
              <div v-if="props.item.is_active == 0">{{ 'Archive' }}</div>
              <div v-else>{{ 'Unarchive' }}</div>
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
                        <v-list-item-title>Update</v-list-item-title>
                      </div>
                    </v-list-item>
                  </template>
                  <v-divider
                    style="margin-left: 10px;margin-right: 10px"
                  ></v-divider>
                  <v-list-item link>
                    <v-list-item-title link>
                      <div
                        @click="archive(props.item.id)"
                        v-if="props.item.is_active == 0"
                      >
                        {{ 'Unarchive' }}
                      </div>
                      <div @click="unarchive(props.item.id)" v-else>
                        {{ 'Archive' }}
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-row>
        <v-col cols="2" style="margin-top: 30px; margin-left: 20px">
          <v-pagination
            prev-icon="mdi-chevron-left"
            next-icon="mdi-chevron-right"
            color="#4662d4"
            v-model="page"
            :length="pageCount"
          ></v-pagination>
        </v-col>
        <v-col cols="2" style="margin-top: 20px; margin-left: 20px;">
          <div class="text-center pt-2">
            <v-select
              :value="items"
              :items="items"
              style="border-radius: 10px; width: 150px;"
              outlined
              solo
              hide-no-data
              hide-selected
              return-object
              label="Items per page"
              type="number"
              min="-1"
              max="15"
              @input="itemsPerPage = parseInt($event, 10)"
            ></v-select>
          </div>
        </v-col>
        <v-col cols="2" v-model="total">
          <p style="margin-top: 45px; color: gray">Total {{ total }} Data</p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectStatus from '../../components/SelectStatus'

  export default {
    components: { SelectWarehouse, SelectStatus },
    data() {
      return {
        page: 1,
        pageCount: 5,
        itemsPerPage: 20,
        items: ['5/page', '10/page', '15/page', '20/page'],
        search: '',
        table: [
          {
            text: 'Helper ID',
            value: 'code',
            align: 'left',
            class: ' black--text title',
          },
          {
            text: 'Name',
            value: 'name',
            align: 'left',
            class: '  black--text title',
          },
          {
            text: 'Phone Number',
            value: 'phone_number',
            class: 'black--text title',
          },
          {
            text: 'Address',
            value: 'address',
            class: 'black--text title',
          },

          {
            text: 'Type',
            value: 'type_name',
            class: 'black--text title',
          },
          {
            text: 'Warehouse',
            value: 'warehouse_name',
            class: 'black--text title',
          },
          {
            text: 'Status',
            value: 'is_active',
            class: 'black--text title',
            key: ['status'],
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
          helper_type: {
            type_name: '',
          },
        },
        total: [],
        id: '',
        warehouse: null,
        warehouse_id: '',
        type: '',
        status: null,
        is_active: null,
        warehouseList: [],
      }
    },
    created() {
      this.renderData()
      this.initialize()
    },
    // mounted() {
    //   this.renderData('', this.status)
    // },
    // watch: {
    //   status: {
    //     handler: function(val) {
    //       this.renderData(this.search, val)
    //     },
    //     deep: true,
    //   },
    // },

    methods: {
      initialize() {
        this.dataTable = [this.dataTable]
        this.total = [this.total]
      },

      //get data user dari API
      renderData() {
        let isActive = ''
        if (this.is_active || this.is_active == 0) {
          isActive = 'is_active:' + this.is_active
        } else {
          isActive = ''
        }

        let warehouseId = ''
        if (this.warehouse_id) {
          if (this.is_active != null) {
            warehouseId = '|warehouse_id.e:' + this.warehouse_id
          } else {
            warehouseId = 'warehouse_id.e:' + this.warehouse_id
          }
        } else {
          warehouseId = ''
        }

        this.$http
          .get('v1/user', {
            params: {
              embeds: 'helper_type_id,warehouse_id',
              conditions: isActive + warehouseId,
            },
          })
          .then((response) => {
            // let that = this;

            this.dataTable = response.data.data
            this.total = response.data.total

            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
      },

      //fungsi untuk unarchive
      unarchive(id) {
        this.$http
          .put('/v1/user/' + id + '/archive', {
            // Headers: {
            //   'Content-Type': 'application/json',
            // },
          })
          .then((response) => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
          })
      },

      //fungsi untuk archive
      archive(id) {
        this.$http
          .put('/v1/user/' + id + '/unarchive', {
            // Headers: {
            //   'Content-Type': 'application/json',
            // },
          })
          .then((response) => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
          })
      },

      warehouseSelected(warehouse) {
        this.warehouse = ''
        this.warehouse_id = ''
        if (warehouse) {
          this.warehouse = warehouse
          this.warehouse_id = warehouse.value
        }
        this.renderData()
      },
      statusSelected(status) {
        this.status = ''
        this.is_active = null
        if (status) {
          this.status = status
          this.is_active = status.value
        }
        this.renderData()
      },
    },
  }
</script>

<style scoped lang="scss">
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
    padding-left: 350px;
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
