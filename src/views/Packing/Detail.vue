<template>
  <div class="helper">
    <h2>PACKING ORDER DETAIL</h2>
    <v-row no-gutters>
      <v-col md="12" style="margin-top: 29px">
        <v-list-item-title v-model="packing_code"
          >Packing Order Code :
          <span class="ml-4">{{ this.packing_code }}</span></v-list-item-title
        >
      </v-col>
    </v-row>
    <v-container>
      <v-row no-gutters style="margin-top: 15px; padding-bottom: 40px">
        <v-col md="6">
          <div>
            <v-btn :to="{ path: '/packing/create-packing' }">Download</v-btn>
          </div>
          <!-- V-DIALOG BUAT TOMBOL UPLOAD MASUK KE DIALOG -->
          <v-dialog v-model="dialog" persistent max-width="430px">
            <template v-slot:activator="{ on, attrs }">
              <div style="padding-left: 240px">
                <v-btn v-bind="attrs" v-on="on">
                  Upload
                </v-btn>
              </div>
            </template>

            <v-card style="border-radius:25px;width: 430px; height: 500px">
              <v-card-title>
                <br />
                <br />
                <span style="padding-top:15px; " class="headline"
                  >Upload File</span
                >
                <v-spacer></v-spacer>
                <v-btn
                  style="margin-left:10px; margin-top: 5px;"
                  color="red"
                  dark
                  fab
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="dialog = false"
                >
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <!-- CONTAINER KE-1 -->
                <v-container v-if="this.file <= 0">
                  <v-row>
                    <div style=" padding-left:15%;">
                      <div
                        style="
                width: 280px;
                height: 270px;
                background-color:#E8E8E8;
                border-radius:20px;
                "
                      >
                        <br />
                        <v-col>
                          <v-icon style="margin-left:107px;font-size:45px">
                            mdi-file</v-icon
                          >
                        </v-col>

                        <v-col cols="5">
                          <v-btn style="margin-left:24px; top: 140px"
                            >choose file</v-btn
                          ></v-col
                        >
                        <v-col style="padding-top: 60px">
                          <span style="margin-left:121px;">Or</span></v-col
                        >
                        <v-col style="padding-top: 5px">
                          <span style="margin-left:85px;"
                            >Drop File Here</span
                          ></v-col
                        >
                      </div>
                    </div>
                  </v-row>
                  <br />
                </v-container>

                <!-- CONTAINER KE-2 -->
                <!-- <v-container v-if="this.file > 0">
                  <v-row>
                    <div style=" padding-left:15%;">
                      <div
                        style="
                width: 280px;
                height: 270px;
                background-color:red;
                border-radius:20px;
                "
                      >
                        <br />
                        <v-col>
                          <v-icon
                            style="margin-left:107px;
              font-size:45px"
                          >
                            mdi-file</v-icon
                          >
                        </v-col>

                        <v-col cols="5"> <v-btn>choose file</v-btn></v-col>
                        <v-col> <span>Or</span></v-col>
                        <v-col>
                          <span style="margin-left:85px;"
                            >Drop File Here</span
                          ></v-col
                        >
                      </div>
                    </div>
                  </v-row>
                  <br />
                </v-container> -->
                <v-btn
                  style="margin-left:35px;
             width: 320px;
             height: 35px;
             background: #4662d4;
             color: white;
             border-radius: 30px;
             box-sizing: content-box;
             text-transform: capitalize;
             cursor: pointer;
             padding: 5px;"
                  color="white"
                  text
                  @click="dialog = false"
                >
                  <div style="text-align:center;">
                    Upload
                  </div>
                </v-btn>
                <br />
                <br />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>

        <v-spacer></v-spacer>

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

    <div>
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :page.sync="page"
        :items-per-page="20"
        @page-count="pageCount = $event"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              {{ props.item.item.item_name }}
              <br />
              <span style="color: grey">{{
                props.item.item.item_uom.item_uom_name
              }}</span>
            </td>
            <td>{{ props.item.total_order }}</td>
            <td>{{ props.item.total_packing }}</td>
            <td>{{ props.item.weight }}</td>
            <td>{{ props.item.helper.code }} - {{ props.item.helper.name }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <br />
    <br /><br />
    <br /><br />
    <br /><br />
    <br /><br />
    <br />
    <v-divider></v-divider>
    <div class="btn">
      <v-btn
        :to="{ path: '/packing-order' }"
        color="#E6E9ED"
        style="margin-left: 80%; color: #768F9C; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
        class="cancel"
        link
        >Back</v-btn
      >
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
        search: '',
        file: 0,
        packing_code: '',
        headers: [
          {
            text: 'Item',
            value: 'item_name',
            sortable: false,
          },
          {
            text: 'Total Order',
            value: 'total_order',
            sortable: false,
          },
          {
            text: 'Total Packing (Pack)',
            value: 'total_packing',
            sortable: false,
          },
          {
            text: 'Total Packing (KG)',
            value: 'weight',
            sortable: false,
          },
          {
            text: 'Packer',
            value: 'packer',
            sortable: false,
          },
        ],
        data: [],
      }
    },
    created() {
      this.renderData()
    },
    methods: {
      renderData() {
        this.$http
          .get('/v1/packing/' + this.$route.params.id)

          .then((response) => {
            this.packing_code = response.data.data.document_code
            this.data = response.data.data.packing_items
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

  thead {
    border-radius: 60px;
  }
  .search {
    padding-left: 100px;
    padding-right: 50px;
    margin-top: 50px;
  }
  thead[data-v-8056b2e8] {
    background: #f0f2f7;
    border: 1px solid #dee2e6;
    box-sizing: border-box;
    border-radius: 20px;
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
  .cancel {
    margin-top: 50px;
    background: #4662d4;
    color: white;
    box-sizing: content-box;
    border-radius: 25px;
    width: 111px;
    height: 45px;
  }
</style>
