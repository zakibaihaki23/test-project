<template>
  <div class="helper">
    <h1>PACKING ORDER DETAIL</h1>

    <v-row>
      <v-col md="12" style="margin-top: 1px" v-model="packing_code">
        <h2>Packing Order Code : {{ this.packing_code }}</h2>
        <!-- <v-list-item-title 
          >Packing Order Code :
          <span class="ml-4">{{ this.packing_code }}</span></v-list-item-title
        > -->
      </v-col>
    </v-row>
    <v-container>
      <v-row no-gutters style="margin-top: 15px; ">
        <!-- FUNGSI DOWNLOAD EXEL -->
        <v-col cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn @click="DownloadFile()">
              Download
            </v-btn>
          </div>

          <!-- V-DIALOG BUAT TOMBOL UPLOAD MASUK KE DIALOG -->
          <v-dialog v-model="dialog" persistent max-width="430px">
            <template v-slot:activator="{ on, attrs }">
              <div style="padding-left: 250px">
                <v-btn v-bind="attrs" v-on="on">
                  Upload
                </v-btn>
              </div>
            </template>

            <v-card style="border-radius:20px;width: 430px; height: 460px">
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
              
              <!-- ISI DIDALAM TOMBOL UPLOAD -->
              <v-card-text>
                <v-container v-if="this.file <= 0">
                  <v-row>
                    <div style=" margin-left:15%;">
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

                        <!-- TOMBOL PILIH FILE UNTUK UPLOAD -->
                        <v-col cols="5">
                          <!-- <v-btn
                            style="margin-left:23px; margin-top:-7px;"
                            color="primary"
                            class="text-none"
                            round
                            depressed
                            :loading="isSelecting"
                            @click="onButtonClick"
                          >
                            <v-icon left>
                              mdi-cloud-upload
                            </v-icon>
                            {{ buttonText }}
                          </v-btn>
                          <input
                            ref="uploader"
                            class="d-none"
                            type="file"
                            accept=".xls, .xlsx"
                            @change="onFileChanged"
                          /> -->
                          
                          
                          <v-btn
                            style="margin-left: 30px;
                                  margin-top: 0px;"
                            >
                           <vue-xlsx-table
                            @on-select-file="handleSelectedFile" 
                            :readAsBS="true"
                            >
                            Choose File
                            </vue-xlsx-table>
                          </v-btn>
                          
                        </v-col>
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
                <!-- <v-btn
                  style="margin-left: 22px;
                        margin-top: 0px;
                        width: 350px; 
                        height: 45px;"
                
                  >
                  Send File
                </v-btn> -->
              </v-card-text>
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
                  hide-details
                  class="search d-flex d-none d-sm-block"
                >
                </v-text-field>
              </template>
              <span>Search by item name</span>
            </v-tooltip>
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
            <td>{{ props.item.total_pack }}</td>
            <td>{{ props.item.total_kg }}</td>
            <!-- <pre>{{ helper }}</pre> -->
            <td>
              <div v-if="props.item.helper">
                <div
                  v-for="(item, idx) in props.item.helper"
                  :key="idx"
                  style="padding: 2px"
                >
                  {{ item.code }} -
                  {{ item.name }}
                </div>
              </div>
              <div v-else>
                -
              </div>
            </td>
            <td v-show="status == 1">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon dark>
                      mdi-dots-horizontal
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-dialog v-model="dialog4" persistent max-width="491px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item
                        v-bind="attrs"
                        v-on="on"
                        @click="openDialog(props.item.id)"
                      >
                        Assign Packer
                      </v-list-item>
                    </template>
                    <v-card
                      style="border-radius: 20px;width: 491px; height: 500px;"
                    >
                      <v-card-title>
                        <br />
                        <br />
                        <span
                          style="padding-top:15px; margin-left: 34%; "
                          class="headline"
                          >Assign Packer</span
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          style="margin-left:10px; margin-top: 5px; background: #6C757D"
                          dark
                          fab
                          small
                          @click="dialog4 = false"
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
                              <p style="color: gray; font-size: 20px">
                                Item *
                              </p>
                              <v-text-field
                                disabled
                                outlined
                                single-line
                                style="border-radius: 10px"
                                v-model="props.item.item.item_name"
                                required
                                append-icon=""
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <p style="color: black; font-size: 20px">
                                Packer
                              </p>
                              <v-text-field
                                outlined
                                single-line
                                style="border-radius: 10px"
                                required
                                v-model="props.item.helper"
                                append-icon=""
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-row>
                          <v-col xl="12" cols="12" md="12" sm="12" lg="12">
                            <v-btn
                              style="margin-left: 25%;bottom: 40px; margin-top: 5px; background: #4662d4; color: white;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;width: 220px;"
                              @click="save"
                              :loading="loading"
                            >
                              Save
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list>
              </v-menu>
              <!-- <AssignPacker v-model="dialog4" @selected="assignPacker">
              </AssignPacker> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <br />
    <br />
    <br />
    <v-divider></v-divider>
    <br />
    <br />
    <br />
    <div class="btn">
      <v-row>
        <v-col md="10" sm="9" cols="5" lg="10" class="text-right">
          <v-btn
            :to="{ path: '/packing-order' }"
            color="#E6E9ED"
            style="bottom: 5px;color: #768F9C; width: 111px; height: 45px; border-radius: 15px; font-size: 14px; margin-left: 87px"
            link
            >Back</v-btn
          >
        </v-col>
      </v-row>
    </div>
     
  </div>
</template>

<script>
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectArea from '../../components/SelectArea'
  import AssignPacker from '../../components/AssignPacker'
  import Vue from 'vue'


  export default {
    components: { SelectWarehouse, SelectArea, AssignPacker, },

    data() {
      return {
        sendFile: '',
        selectedFile: null,
        isSelecting: false,
        download: '',
        dialog: false,
        dialog4: false,
        item: null,
        uom: '',
        search: '',
        file: 0,
        packing_code: '',
        data: [],
        headers: [
          {
            text: 'Item',
            value: 'item.item_name',
            sortable: false,
            class: 'black--text title',
          },
          {
            text: 'Total Order',
            value: 'total_order',
            sortable: false,
            class: 'black--text title',
          },
          {
            text: 'Total Packing (Pack)',
            value: 'total_packing',
            sortable: false,
            class: 'black--text title',
          },
          {
            text: 'Total Packing (KG)',
            value: 'weight',
            sortable: false,
            class: 'black--text title',
          },
          {
            text: 'Packer',
            value: 'helper.code',
            sortable: false,
            class: 'black--text title',
          },
          {
            value: 'actions',
            sortable: false,
          },
        ],
        data: [],
        status: [],
      }
    },

    computed: {
      buttonText() {
        return this.selectedFile
          ? this.selectedFile.name
          : this.defaultButtonText
      },
    },

    created() {
      this.renderData()
    },

    methods: {

      // BAGIAN UPLOAD FILE XLXS TO JSON
      handleSelectedFile (convertedData) {
           console.log(convertedData)
           this.disable = false
                let that = this
                    let data = [];
                    convertedData.body.forEach((item) => {
                    data.push(
                      {
                        "packing_item_id":item.Packing_Item_Id,
                        "total_pack": parseFloat (item.Total_Pack),
                        "total_kg" : parseFloat (item.Total_Kg),
                        "helper_id":item.Packer_Id,
                      }
                    )
                }); 
                let send = {
                  "packings" : data
                }
                  console.log(send)
                  this.sendFile = send
                this.$http
                .put('/packing/' + this.$route.params.id, send)
                .then(response => {
                    // Vue.$toast.open({
                    //     position: 'top-right',
                    //     message: 'Data has been saved successfully',
                    //     type: 'success',
                    // });
                    window.location.reload()
                })
                
      },

      renderData() {
        this.$http
          .get('/packing/' + this.$route.params.id)

          .then((response) => {
            this.packing_code = response.data.data.document_code
            this.data = response.data.data.packing_items
            this.status = response.data.data.status
          })
      },

      // DOWNLOAD FILE FROM
      DownloadFile() {
        this.$http
          .get('/packing/' + this.$route.params.id + '/template?export=1')

          .then((response) => {
            window.open(response.data.file)
            console.log(response.data.file)
          })
      },

      save(){
        this.$http
        .get('/v1/packing/' + this.$route.params.id)

        .then((response) => {
                this.$router.push('/packing-order')
                this.$toast.success('Data has been saved successfully')
              })
              .catch((error) => {
                this.error = error.response.data.errors
                console.log(this.error)
              })
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
    font-size: 16px;
    height: 50px;
    background: #4662d4;
    font-weight: bold;
    color: white;
    border-radius: 25px;
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
