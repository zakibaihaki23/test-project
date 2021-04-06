<template>
  <div class="helper">
    <h2>HELPER LIST</h2>
    <!-- SHOW ONLY ON XS DEVICE -->
    <!-- <v-container>
      <v-row>
        <v-col cols="12" sm="6" lg="6" md="6">
          <div class="d-sm-none">
            <v-btn :to="{ path: '/helper/create-helper' }">Create Helper</v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="6" lg="6" md="6">
          <div>
            <v-tooltip top>
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
                  class=" d-sm-none"
                  style="margin-top: 150px;"
                >
                </v-text-field>
              </template>
              <span>search by helper code, name, or phone number</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <p class="d-sm-none" style="font-size: 25px; margin-top: 40px">
      Filter
    </p>
    <v-divider class="d-sm-none" style="margin-right: 40px;"></v-divider> -->
    <!-- FOR ALL DEVICE -->
    <v-container>
      <v-row>
        <v-col cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn :to="{ path: '/helper/create-helper' }">Create Helper</v-btn>
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
              <span>search by helper code, name, or phone number</span>
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
      <v-col xl="2" md="2" sm="6" cols="12" lg="2">
        <SelectStatus v-model="status" @selected="statusSelected">
        </SelectStatus>
      </v-col>
      <v-col xl="10" md="10" sm="6" cols="12" lg="10">
        <SelectWarehouse v-model="warehouse" @selected="warehouseSelected">
        </SelectWarehouse>
      </v-col>
    </v-row>
    <br />
    <div>
      <v-data-table
        loading-text="Please Wait...."
        :headers="table"
        :items="dataTable"
        :page.sync="page"
        :items-per-page="10"
        :search="search"
        @page-count="pageCount = $event"
        :loading="isLoading"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.code }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone_number }}</td>
            <td>{{ props.item.address }}</td>
            <!-- <td v-if="props.item.user">
              {{ props.item.user.is_active }}
            </td>
            <td v-else>
              -
            </td> -->
            <td>{{ props.item.helper_type.type_name }}</td>
            <td>{{ props.item.warehouse.warehouse_name }}</td>
            <td v-if="props.item.user">
              <div v-if="props.item.user.is_active == 0">
                {{ 'Inactive' }}
              </div>
              <div v-else>{{ 'Active' }}</div>
            </td>
            <td v-else>
              -
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
                  <v-list-item link v-if="props.item.user">
                    <v-list-item-title link>
                      <div
                        @click="unarchive(props.item.id)"
                        v-if="props.item.user.is_active == 0"
                      >
                        {{ 'Active' }}
                      </div>
                      <div @click="archive(props.item.id)" v-else>
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
        search: '',
        isLoading: true,

        table: [
          {
            text: 'Helper ID',
            value: 'code',
            class: 'black--text',
          },
          {
            text: 'Name',
            value: 'name',
            class: 'black--text',
          },
          {
            text: 'Phone Number',
            value: 'phone_number',
            class: 'black--text',
          },
          {
            text: 'Address',
            value: 'address',
            class: 'black--text',
          },

          {
            text: 'Type',
            value: 'helper_type.type_name',
            class: 'black--text',
          },
          {
            text: 'Warehouse',
            value: 'warehouse.warehouse_name',
            class: 'black--text',
          },
          {
            text: 'Status',
            value: 'user.is_active',
            class: 'black--text',
          },
          {
            text: 'actions',
            value: 'actions',
            class: 'black--text',
          },
        ],

        dataTable: {
          warehouse: {
            warehouse_name: '',
          },
          helper_type: {
            type_name: '',
          },
          user: {
            name: '',
          },
        },
        id: '',
        warehouse: null,
        warehouse_id: '',
        type: '',
        status: null,
        filterActive: null,
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
      },

      //get data user dari API
      renderData() {
        let isActive = ''
        if (this.filterActive || this.filterActive == 0) {
          isActive = 'user.is_active:' + this.filterActive
        } else {
          isActive = ''
        }

        let warehouseId = ''
        if (this.warehouse_id) {
          if (this.filterActive != null) {
            warehouseId = '|warehouse_id.e:' + this.warehouse_id
          } else {
            warehouseId = 'warehouse_id.e:' + this.warehouse_id
          }
        } else {
          warehouseId = ''
        }

        this.$http
          .get('/helper', {
            params: {
              embeds: 'user_id,helper_type_id,warehouse_id',
              conditions: isActive + warehouseId,
              orderby: '-id',
            },
          })
          .then((response) => {
            this.isLoading = false
            this.dataTable = response.data.data

            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
      },

      //fungsi untuk unarchive
      archive(id) {
        this.$http
          .put('/helper/' + id + '/archive', {
            // Headers: {
            //   'Content-Type': 'application/json',
            // },
          })
          .then((response) => {
            this.$toast.success('User Not Active')
            this.renderData()
          })
          .catch((error) => {
            console.log(error)
          })
      },

      //fungsi untuk archive
      unarchive(id) {
        this.$http
          .put('/helper/' + id + '/unarchive', {
            // Headers: {
            //   'Content-Type': 'application/json',
            // },
          })
          .then((response) => {
            this.$toast.success('User Active')
            this.renderData()
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
        this.filterActive = null
        if (status) {
          this.status = status
          this.filterActive = status.value
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
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size: 13px;
  }
  .helper {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding-left: 80px;
    padding-right: 50px;
  }

  .v-btn:not(.v-btn--round).v-size--default {
    position: absolute;
    width: 145px;
    height: 50px;
    background: #4662d4;
    color: white;
    border-radius: 30px;

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
