<template>
  <div class="helper">
    <h2>PACKING ITEM</h2>
    <v-container>
      <!-- <v-row no-gutters>
        <v-col md="6"> </v-col>
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
      </v-row> -->
    </v-container>
    <!-- <p style="font-size: 20px; margin-top: 25px">Filter</p>
    <v-col md="12">
      <v-divider style="margin-right: 40px"></v-divider>
    </v-col> -->
    <!-- <v-row> -->
    <!-- <v-col cols="2">
        <template>
          <SelectArea v-model="area" @selected="areaSelected"></SelectArea>
        </template>
      </v-col> -->

    <!-- <v-col cols="2"> -->
    <!-- <SelectWarehouse
          :areaId="area"
          v-model="warehouseList"
          @selected="warehouseSelected"
          :disabled="warehouseDisabled"
        >
        </SelectWarehouse> -->
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
    <!-- </v-col> -->
    <!-- </v-row> -->
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div>
      <v-data-table
        :headers="headers"
        :items="data"
        hide-default-footer
        hide-default-header
      >
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <tr>
              <th v-for="h in headers" :class="h.class" :key="h.value">
                <span>{{ h.text }}</span>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.no }}</td>
            <td>{{ props.item.item }}</td>
            <td>{{ props.item.uom }}</td>
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
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <button class="button" v-bind="attrs" v-on="on">+ Add Item</button>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Add Item</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Item*"
                    v-model="item"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Uom*"
                    v-model="uom"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small><span style="color: red">*</span>required</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        dialog: false,
        item: '',
        uom: '',
        headers: [
          {
            text: 'No.',
            value: 'no',
            sortable: false,
          },
          {
            text: 'Item',
            value: 'item',
          },
          {
            text: 'UOM',
            value: 'uom',
            sortable: false,
          },
          {
            value: 'actions',
            sortable: false,
          },
        ],
        data: [
          {
            no: '1',
            item: 'Buncis',
            uom: 'KG',
          },
          {
            no: '2',
            item: 'Baby Buncis',
            uom: 'KG',
          },
          {
            no: '3',
            item: 'Jagung Manis',
            uom: 'KG',
          },
          {
            no: '4',
            item: 'Kacang Panjang',
            uom: 'KG',
          },
          {
            no: '5',
            item: 'Labu Isam Acar',
            uom: 'KG',
          },
        ],
      }
    },
    methods: {
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
  /* .v-btn:not(.v-btn--round).v-size--default {
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
  } */
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
</style>
