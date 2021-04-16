<template>
  <div class="helper">
    <h1>PACKABLE ITEM LIST</h1>
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
                        v-model="packable_item"
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
          <template>
            <div class="d-flex d-none d-sm-block">
              <v-btn @click="openDialog">Add Packable Item</v-btn>
            </div>
          </template>
          <v-dialog v-model="dialog" persistent max-width="491px">
            <div class="text-center">
              <v-overlay :value="overlay">
                <v-progress-circular
                  color="primary"
                  indeterminate
                  :size="70"
                ></v-progress-circular>
              </v-overlay>
            </div>
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
                  color="#6C757D"
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
                      <p style="color: black; font-size: 20px">
                        Item <span style="color: red">*</span>
                      </p>
                      <AddPackableItem
                        v-model="packable_item"
                        @selected="itemSelected"
                        :clear="clear"
                      >
                      </AddPackableItem>
                    </v-col>
                    <v-col cols="12">
                      <p style="color: gray; font-size: 20px">UOM *</p>
                      <v-text-field
                        disabled
                        outlined
                        single-line
                        style="border-radius: 10px"
                        v-model="uom"
                        required
                        append-icon=""
                        label="UOM"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-row>
                  <v-col>
                    <v-btn
                      style="bottom: 30px; margin-top: 5px; background: #4662d4; color: white; border-style: solid; border-color: #4662d4;  border-radius: 100px; width: 220px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                      @click="save((overlay = !overlay))"
                    >
                      Save
                    </v-btn>
                  </v-col>
                  <!-- <v-btn
                  style="margin-left: 25%;bottom: 40px; margin-top: 15px; background: #4662d4; color: white;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;width: 220px;"
                  @click="save"
                  :loading="loading"
                >
                  Save
                </v-btn> -->
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
                  class="search d-flex d-none d-sm-block"
                  hide-details
                >
                </v-text-field>
              </template>
              <span>Search by item name, item code and uom</span>
            </v-tooltip>
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
            <td>{{ props.item.item_code }}</td>
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
                <v-list class="menu">
                  <v-list-item
                    link
                    style="width: 150px; "
                    @click="popupDialog(props.item.id)"
                  >
                    <div>
                      Delete
                    </div>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog2" persistent max-width="360px">
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
            >Are you sure to change this item to<br />
            <b>Unpackable</b> ?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row>
              <v-col xl="5" cols="6" md="6" sm="6" lg="6">
                <v-btn
                  @click="dialog2 = false"
                  style="margin-bottom: 20px; margin-top: 5px; background: #4662d4; color: white;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;"
                >
                  No
                </v-btn>
              </v-col>
              <v-col xl="5" cols="6" md="6" sm="6" lg="6">
                <v-btn
                  text
                  @click="unpackable(idItem, (overlay = !overlay))"
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
  import SelectArea from '../../components/SelectArea'
  import AddPackableItem from '../../components/AddPackableItem'
  export default {
    components: { SelectWarehouse, SelectArea, AddPackableItem },
    data() {
      return {
        page: 1,
        clearItem: false,
        dialog: false,
        dialog2: false,
        search: '',
        item: '',
        item_input: '',
        packable_item: null,
        uom: '',
        clear: '',
        isLoading: true,
        overlay: false,
        headers: [
          {
            text: 'Item Code',
            value: 'item_code',
            class: 'black--text title',
          },
          {
            text: 'Item',
            value: 'item_name',
            class: 'black--text title',
          },
          {
            text: 'UOM',
            value: 'item_uom.item_uom_name',
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
    watch: {
      search: {
        handler: function(val) {
          this.renderData(val)
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
    created() {
      this.renderData()
    },

    methods: {
      openDialog() {
        this.renderData('')
        this.uom = null
        this.dialog = true
      },
      popupDialog(id) {
        this.dialog2 = true
        this.idItem = id
      },
      initialize() {
        this.dataTable = [this.dataTable]
      },
      renderData(search) {
        // GET PACKABLE WHEN 1
        this.$http
          .get('/inventory/item', {
            params: {
              orderby: '-id',
              embeds: 'item_uom_id',
              page: '1',
              conditions: 'packable:1',
            },
          })
          .then((response) => {
            this.dataTable = response.data.data
            this.item = []

            let array = response.data.data
            if (length > 0) {
              for (let i = 0; i < array.length; i++) {
                this.item.push({
                  item_name: array[i].item_name,
                  id: array[i].id,
                })
              }

              if (this.dataTable === null) {
                this.dataTable = []
              }
            }
            this.isLoading = false
          })
      },
      unpackable(id) {
        this.overlay = true
        this.clear = false
        this.$http
          .put('/inventory/item/unpackable/' + id, {})
          .then((response) => {
            let self = this
            setTimeout(function() {
              self.overlay = false
              self.clear = true
              self.renderData()
              self.$toast.success('Item not packable')
              self.dialog2 = false
              self.loading = false
              self.btnDisabled = false
              self.renderData()
            }, 1000)
          })
      },
      save() {
        this.overlay = true
        this.clear = false
        this.$http
          .put('/inventory/item/packable/' + this.packable_item, {})
          .then((response) => {
            this.overlay = false
            this.loading = false
            this.dialog = false
            this.renderData()
            this.clear = true
            this.$toast.success('Add packable ' + response.data.status)
          })
      },
      itemSelected(d) {
        this.uom_id = ''
        this.uom = ''
        this.packable_item = ''
        this.item_name = ''
        if (d) {
          this.uom_id = d.uom_id
          this.packable_item = d.value
          this.uom = d.uom
          this.item_name = d.item_name
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
    font-size: 17px;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    width: 220px;
    font-weight: bold;
    height: 50px;
    background: #4662d4;
    color: white;
    border-radius: 25px;
    font-size: 16px;
    margin-top: 50px;
    text-transform: capitalize;
    cursor: pointer;
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
