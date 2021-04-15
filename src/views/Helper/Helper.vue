<template>
  <div class="helper">
    <h1>HELPER LIST</h1>
    <!-- FOR ALL DEVICE -->
    <v-container>
      <v-row>
        <v-col cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn
              :to="{ path: '/helper/create-helper' }"
              style="position: absolute;width: 200px;height: 50px;background: #4662d4;color: white;border-radius: 30px;font-size: 16px;margin-top: 50px;font-weight: bold;text-transform: capitalize;cursor: pointer;padding: 5px;"
              >Create Helper</v-btn
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
        <SelectStatus
          v-bind="attrs"
          v-on="on"
          v-model="status"
          @selected="statusSelected"
        >
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
            <td>
              <div v-if="props.item.address">{{ props.item.address }}</div>
              <div v-else>-</div>
            </td>

            <td>{{ props.item.helper_type.type_name }}</td>
            <td>
              {{ props.item.warehouse.warehouse_code }} -
              {{ props.item.warehouse.warehouse_name }}
            </td>
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
                  <v-list-item
                    link
                    v-if="props.item.user.is_active == 0"
                    @click="
                      openDialog(props.item.user.is_active, props.item.id)
                    "
                  >
                    <div>
                      <v-list-item-title>Active </v-list-item-title>
                    </div>
                  </v-list-item>
                  <v-list-item
                    v-else
                    link
                    @click="
                      openDialog(props.item.user.is_active, props.item.id)
                    "
                  >
                    <div>
                      <v-list-item-title>Inactive</v-list-item-title>
                    </div>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" persistent max-width="360px">
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
                  :disabled="btnDisabled"
                  @click="dialog = false"
                  style="margin-bottom: 20px; margin-top: 5px; background: #4662d4; color: white;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                >
                  No
                </v-btn>
              </v-col>
              <v-col xl="5" cols="6" md="6" sm="6" lg="6">
                <v-btn
                  v-if="statusUser == 1"
                  :loading="loadingBtn"
                  text
                  @click="archive(idUser)"
                  style="margin-bottom: 10px; margin-top: 5px; background: white; color: #4662d4; border-style: solid; border-color: #4662d4;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                >
                  Yes
                </v-btn>
                <v-btn
                  :loading="loadingBtn"
                  v-if="statusUser == 0"
                  text
                  @click="unarchive(idUser)"
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
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectStatus from '../../components/SelectStatus'

  export default {
    components: { SelectWarehouse, SelectStatus },
    data() {
      return {
        page: 1,
        btnDisabled: false,
        dialog: false,
        search: '',
        loadingBtn: false,
        isLoading: true,

        table: [
          {
            text: 'Helper Code',
            value: 'code',
            class: 'black--text title',
          },
          {
            text: 'Name',
            value: 'name',
            class: 'black--text title',
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
            value: 'helper_type.type_name',
            class: 'black--text title',
          },
          {
            text: 'Warehouse',
            value: 'warehouse.warehouse_name',
            class: 'black--text title',
          },
          {
            text: 'Status',
            value: 'user.is_active',
            class: 'black--text title',
          },
          {
            value: 'actions',
            class: 'black--text title',
            sortable: false,
          },
        ],

        dataTable: [],
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
      openDialog(status, id) {
        this.dialog = true
        this.idUser = id
        this.statusUser = status
        if (status == 1) {
          this.text = 'Inactive'
        } else {
          this.text = 'Active'
        }
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
        this.btnDisabled = true
        this.loadingBtn = true
        this.$http
          .put('/helper/' + id + '/archive', {})
          .then((response) => {
            let self = this
            setTimeout(function() {
              self.$toast.success('User Not Active')
              self.dialog = false
              self.renderData()
              self.loadingBtn = false
              self.btnDisabled = false
            }, 15 * 15 * 15)
          })
          .catch((error) => {
            this.$toast.error(error.response.data.errors.id)
            this.loadingBtn = false
            this.dialog = false
            this.btnDisabled = false
          })
      },

      //fungsi untuk archive
      unarchive(id) {
        this.btnDisabled = true
        this.loadingBtn = true
        this.$http
          .put('/helper/' + id + '/unarchive', {})
          .then((response) => {
            let self = this
            setTimeout(function() {
              self.$toast.success('User Active')
              self.dialog = false
              self.renderData()
              self.loadingBtn = false
              self.btnDisabled = false
            }, 15 * 15 * 15)
          })
          .catch((error) => {
            self.btnDisabled = false
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
    font-size: 17px;
  }
  .helper {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding-left: 80px;
    padding-right: 50px;
  }

  // .v-btn:not(.v-btn--round).v-size--default {
  //   position: absolute;
  //   width: 200px;
  //   height: 50px;
  //   background: #4662d4;
  //   color: white;
  //   border-radius: 30px;
  //   font-size: 16px;
  //   margin-top: 50px;
  //   font-weight: bold;
  //   text-transform: capitalize;
  //   cursor: pointer;
  //   padding: 5px;
  // }
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
