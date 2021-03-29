<template>
  <div class="helper">
    <h2>PACKABLE ITEM LIST</h2>
    <v-container>
      <v-row no-gutters>
        <v-col md="6">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="491px"
            style="border-radius: 1000px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">Create Item</v-btn>
            </template>
            <v-card style="border-radius: 20px;width: 491px; height: 500px;">
              <v-card-title>
                <br />
                <br />
                <span
                  style="padding-top:15px; margin-left: 23%; "
                  class="headline"
                  >ADD PACKABLE ITEM</span
                >
                <v-spacer></v-spacer>
                <v-btn
                  style="margin-left:10px; margin-top: 5px;"
                  color="red"
                  dark
                  fab
                  small
                  @click="dialog = false"
                >
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row style="margin-top: 35px">
                    <v-col cols="12">
                      <v-text-field
                        outlined
                        solo
                        style="border-radius: 10px"
                        v-model="item"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        disabled
                        outlined
                        solo
                        style="border-radius: 10px"
                        label="KG"
                        v-model="uom"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn style="margin-left: 25%; bottom: 30px" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    <br />
    <br />
    <br />

    <div>
      <v-data-table
        loading-text="Please Wait...."
        :headers="headers"
        :items="dataTable"
        :page.sync="page"
        :items-per-page="20"
        :search="search"
        @page-count="pageCount = $event"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.group_name }}</td>
            <td>{{ props.item.item_uom.item_uom_name }}</td>
            <td>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon>
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
                          >Delete</v-list-item-title
                        >
                      </div>
                    </v-list-item>
                  </template>
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
  import SelectArea from '../../components/SelectArea'
  export default {
    components: { SelectWarehouse, SelectArea },
    data() {
      return {
        page: 1,
        dialog: false,
        search: '',
        item: '',
        uom: '',
        headers: [
          // {
          //   text: 'No.',
          //   value: 'no',
          //   sortable: false,
          // },
          {
            text: 'Item',
            value: 'group_name',
          },
          {
            text: 'UOM',
            value: 'item_uom.item_uom_name',
          },
          {
            value: 'actions',
            sortable: false,
          },
        ],
        dataTable: [],
        total: [],
      }
    },
    created() {
      this.renderData()
    },
    methods: {
      initialize() {
        this.dataTable = [this.dataTable]
        this.total = [this.total]
      },
      renderData() {
        this.$http
          .get('/v1/inventory/group', {
            params: {
              embeds: 'item_uom_id',
              page: '1',
            },
          })
          .then((response) => {
            this.dataTable = response.data.data
            this.total = response.data.total

            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
      },
      save() {
        localStorage.item = this.item
        localStorage.uom = this.uom
        window.location.reload()
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
  thead[data-v-8056b2e8] {
    background: #f0f2f7;
    border: 1px solid #dee2e6;
    box-sizing: border-box;
    border-radius: 20px;
  }
  .button {
    background: #f0f2f7;
    border: 1px solid #dee2e6;
    box-sizing: border-box;
    border-radius: 20px;
    width: 100%;
    max-height: 290px;
    height: 50px;
  }
  .v-application .blue--text.text--darken-1 {
    color: #1e88e5 !important;
    caret-color: #1e88e5 !important;
  }
  .v-dialog {
    border-radius: 20px;
  }
</style>
