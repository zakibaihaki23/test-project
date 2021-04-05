<template>
  <div class="helper">
    <h2>PACKABLE ITEM LIST</h2>
    <!-- SHOW ONLY ON XS DEVICE -->
    <!-- <v-container>
      <v-row>
        <v-col cols="12" sm="6" lg="6" md="6">
          <v-dialog v-model="dialog" persistent max-width="491px">
            <template v-slot:activator="{ on, attrs }">
              <div class="d-sm-none">
                <v-btn v-bind="attrs" v-on="on">Add Packable Item</v-btn>
              </div>
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
                  <v-row style="margin-top: 1px">
                    <v-col cols="12">
                      <p style="color: black">
                        Item <span style="color: red">*</span>
                      </p>
                      <v-autocomplete
                        outlined
                        single-line
                        style="border-radius: 10px"
                        item-text="item_name"
                        item-value="id"
                        v-model="item_list"
                        :items="item_input"
                        required
                        append-icon=""
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <p style="color: gray">UOM *</p>
                      <v-autocomplete
                        outlined
                        single-line
                        item-text="uom"
                        item-value="uom_id"
                        :items="item"
                        style="border-radius: 10px"
                        v-model="uom"
                        required
                        @selected="uomSelected"
                        append-icon=""
                      ></v-autocomplete>
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
        <v-col>
          <div>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              rounded
              label="Search...."
              solo
              class="d-sm-none"
              style="margin-top: 150px;"
              hide-details
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-container> -->
    <!-- FOR ALL DEVICE -->
    <v-container>
      <v-row>
        <v-col cols="3" sm="6" md="6" lg="7">
          <v-dialog v-model="dialog" persistent max-width="491px">
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex d-none d-sm-block">
                <v-btn v-bind="attrs" v-on="on">Add Packable Item</v-btn>
              </div>
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
                  <v-row style="margin-top: 1px">
                    <v-col cols="12">
                      <p style="color: black">
                        Item <span style="color: red">*</span>
                      </p>
                      <AddPackableItem
                        v-model="item_list"
                        @selected="itemSelected"
                      >
                      </AddPackableItem>
                      <!-- <v-autocomplete
                        outlined
                        single-line
                        style="border-radius: 10px"
                        item-text="item_name"
                        item-value="id"
                        v-model="item_list"
                        :items="item_input"
                        required
                        @selected="itemSelected"
                        append-icon=""
                        clearable
                        return-object
                      >
                        <template slot="selection" slot-scope="data">
                          {{ data.item.item_name }}
                        </template>
                      </v-autocomplete> -->
                    </v-col>
                    <v-col cols="12">
                      <p style="color: gray">UOM *</p>
                      <v-text-field
                        disabled
                        outlined
                        single-line
                        style="border-radius: 10px"
                        v-model="uom"
                        required
                        append-icon=""
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
        <v-col>
          <div>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              rounded
              label="Search...."
              solo
              class="search d-flex d-none d-sm-block"
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
        :items-per-page="10"
        :search="search"
        @page-count="pageCount = $event"
        :loading="isLoading"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.item_name }}</td>
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
                    <v-list-item link style="width: 150px; ">
                      <div>
                        <v-list-item-title link>Delete</v-list-item-title>
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
  import AddPackableItem from '../../components/AddPackableItem'
  export default {
    components: { SelectWarehouse, SelectArea, AddPackableItem },
    data() {
      return {
        page: 1,
        dialog: false,
        search: '',
        item: '',
        item_input: '',
        item_list: '',
        uom: '',
        isLoading: true,
        headers: [
          // {
          //   text: 'No.',
          //   value: 'no',
          //   sortable: false,
          // },
          {
            text: 'Item',
            value: 'item_name',
            class: 'black--text',
          },
          {
            text: 'UOM',
            value: 'item_uom.item_uom_name',
            class: 'black--text',
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
    methods: {
      initialize() {
        this.dataTable = [this.dataTable]
        this.total = [this.total]
      },
      renderData() {
        // GET PACKABLE WHEN 0
        this.$http
          .get('/inventory/item', {
            params: {
              embeds: 'item_uom_id',
              page: '1',
              conditions: 'packable:0',
            },
          })
          .then((response) => {
            this.item_input = []

            let array = response.data.data
            for (let i = 0; i < array.length; i++) {
              this.item_input.push({
                item_name: array[i].item_name,
                uom: array[i].item_uom.item_uom_name,
                uom_id: array[i].item_uom.id,
                value: array[i].id,
              })
              // this.itemSelected(response.data.data)
            }
          })
        // GET PACKABLE WHEN 1
        this.$http
          .get('/inventory/item', {
            params: {
              embeds: 'item_uom_id',
              page: '1',
              conditions: 'packable:1',
            },
          })
          .then((response) => {
            this.dataTable = response.data.data
            this.item = []

            let array = response.data.data
            for (let i = 0; i < array.length; i++) {
              this.item.push({
                item_name: array[i].item_name,
                id: array[i].id,
              })
            }
            this.isLoading = false

            if (this.dataTable === null) {
              this.dataTable = []
            }
          })
      },
      save() {
        this.uom_id
        this.item_list
        console.log(this.item_list)
      },
      itemSelected(d) {
        this.uom_id = ''
        this.uom = ''
        this.item_list = ''
        if (d) {
          this.uom_id = d.uom_id
          this.item_list = d.value
          this.uom = d.uom
        }
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
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size: 13px;
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
