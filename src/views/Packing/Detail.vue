<template>
  <div class="helper">
    <v-row>
      <v-cols md="12" style="margin-left: 12px">
        <h1>PACKING ORDER DETAIL</h1>
      </v-cols>
    </v-row>

    <br>
    <br>
    <br>

    <v-row>
      <v-col md="2" style="margin-top: 1px">
        <h2>Packing Order Code </h2>
      </v-col>
      <v-col>
        <h2> : {{ this.packing_code }} </h2>
      </v-col>  
    </v-row>


     <v-row style="margin-top: -20px;">
        <v-col md="2">
          <h3>
            Warehouse
          </h3>
        </v-col>
        <v-col> 
          <b>: {{warehouse_name}}</b>
        </v-col>
    </v-row>

    <v-row style="margin-top: -20px;">
      <v-col md="2">
        <h3> Delivery Date </h3>
      </v-col>
      <v-col>
        <b> : {{ this.delivery_date | moment('DD/MM/YYYY') }} </b>
      </v-col>
    </v-row>

    
    <v-row style="margin-top: -20px;">
        <v-col md="2">
          <h3>
            Status 
          </h3>
        </v-col>
        <v-col> 
          <b>: </b>
          <span v-if="status == 1"> 
           <b>{{ 'Active' }} </b>
          </span>
           <span v-if="status == 2"> 
           <b>{{ 'Finished' }} </b>
          </span>
           <span v-if="status == 3"> 
           <b>{{ 'Cancelled' }} </b>
          </span>
          
        </v-col>
    </v-row>


    <v-container>
      <v-row no-gutters style="margin-top: -3px; ">
        <!-- FUNGSI DOWNLOAD EXEL -->
        <v-col v-show="status == 1" cols="3" sm="6" md="6" lg="7">
          <div class="d-flex d-none d-sm-block">
            <v-btn :loading="dwnLoading" @click="openDialogDwn()">
              Download
            </v-btn>
          </div>
        </v-col>

        <v-col v-show="status == 1" cols="3" sm="6" md="6" lg="7">
          <!-- V-DIALOG BUAT TOMBOL UPLOAD MASUK KE DIALOG -->
          <v-dialog
            v-show="status == 1"
            v-model="dialog"
            persistent
            max-width="430px"
          >
            <template v-slot:activator="{ on, attrs }">
              <!-- SHOW ON LARGE DISPLAY -->
              <div style="padding-left: 250px">
                <v-btn
                  class="d-none d-sm-none d-sm-flex"
                  v-bind="attrs"
                  v-on="on"
                >
                  Upload
                </v-btn>
              </div>
              <!-- SHOW ON SMALL DEVICE -->
              <div style="margin-top: 90px;">
                <v-btn
                  class="d-sm-none d-md-none d-lg-none d-xl-none"
                  v-bind="attrs"
                  v-on="on"
                >
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

                          <!-- TOMBOL UPLOAD -->
                          <vue-xlsx-table
                            class="xlsx-button"
                            @on-select-file="handleSelectedFile"
                            :readAsBS="true"
                            style="
                                    margin-left: 30px;
                                    marign-top: 50px;
                                    "
                          >
                            Choose File
                          </vue-xlsx-table>
                        </v-col>
                      </div>
                    </div>
                  </v-row>
                  <br />
                </v-container>
              </v-card-text>

              <v-btn
                :loading="uploadLoading"
                @click="openDialogUpload()"
                :disabled="disabledBtnSend"
                style="
                      width: 340px;
                      margin-left: 50px;
                      margin-top: -20px;"
                color="primary"
              >
                Send File
              </v-btn>
            </v-card>
          </v-dialog>
        </v-col>

        <v-col v-show="status != 1" cols="3" sm="6" md="6" lg="7"> </v-col>
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
                  class="search d-none d-sm-none d-sm-flex"
                >
                </v-text-field>
              </template>
              <span>Search by item name</span>
            </v-tooltip>
          </div>
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
                  class="search2 d-sm-none d-md-none d-lg-none d-xl-none"
                >
                </v-text-field>
              </template>
              <span>search by helper code, name, or phone number</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <br />
    <br />

    <div>
      <v-skeleton-loader
        v-if="firstLoad"
        :loading="isLoading"
        type="table-tbody"
        :types="{ 'table-row': 'table-cell@6' }"
      ></v-skeleton-loader>
      <v-data-table
        v-show="!firstLoad"
        :headers="headers"
        :items="data"
        :search="search"
        :page.sync="page"
        :items-per-page="5"
        @page-count="pageCount = $event"
        :loading="isLoading"
        loading-text="Please Wait....."
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
                  <v-list-item
                    @click="
                      openDialog(
                        props.item.id,
                        props.item.item.item_name,
                        props.item.helper
                      )
                    "
                  >
                    Assign Packer
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-dialog v-model="dialogPacker" persistent max-width="491px">
        <v-card style="border-radius: 20px;width: 491px; height: 500px;">
          <v-card-title>
            <br />
            <br />
            <span style="padding-top:15px; margin-left: 34%; " class="headline"
              >Assign Packer</span
            >
            <v-spacer></v-spacer>
            <v-btn
              style="margin-left:10px; margin-top: 5px; background: #6C757D; color: white"
              fab
              small
              @click="dialogPacker = false"
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
                    v-model="itemName"
                    disabled
                    outlined
                    single-line
                    style="border-radius: 10px"
                    required
                    append-icon=""
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <p style="color: black; font-size: 20px">
                    Packer
                  </p>

                  <v-autocomplete
                    outlined
                    :items="packer"
                    single-line
                    style="border-radius: 10px"
                    required
                    chips
                    color="blue-grey lighten-2"
                    item-text="name"
                    item-value="id"
                    v-model="packerName"
                    append-icon=""
                    return-object
                    @change="addPacker"
                    hide-selected
                    multiple
                  >
                    <template slot="item" slot-scope="data">
                      {{ data.item.code }} - {{ data.item.name }}
                    </template>
                    <template v-slot:selection="{ item }">
                      <v-chip color="primary" text-color="white">{{
                        item.name
                      }}</v-chip>
                    </template>
                    <template v-slot:label style="padding: 10px">
                      Packer</template
                    >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col xl="12" cols="12" md="12" sm="12" lg="12">
                <v-btn
                  style="margin-left: 25%;bottom: 40px; margin-top: 5px; background: #4662d4; color: white;  border-radius: 100px; width: 96px;font-weight: bold; height: 50px; padding: 4px; font-size: 16px; text-transform: capitalize;width: 220px;"
                  @click="opendialogPacker"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        <v-col md="1" sm="1" cols="1" lg="1" class="text-left">
          <v-btn
            :to="{ path: '/packing-order' }"
            color="#E6E9ED"
            style="bottom: 5px;color: #768F9C; width: 111px; height: 50px; border-radius: 25px; font-size: 14px; margin-left: 0px"
            link
            >Back</v-btn
          >
        </v-col>
      </v-row>
    </div>

    <!-- BLOCK UI -->
    <v-dialog v-model="dialogblock" persistent max-width="1px">
      <div class="text-center">
        <v-overlay :value="overlay">
          <v-progress-circular
            color="primary"
            indeterminate
            :size="20"
          ></v-progress-circular>
        </v-overlay>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  import SelectWarehouse from '../../components/SelectWarehouse'
  import SelectArea from '../../components/SelectArea'
  import AssignPacker from '../../components/AssignPacker'

  export default {
    components: { SelectWarehouse, SelectArea, AssignPacker },

    data() {
      return {
        file: 0,
        status: '',
        packing_code: '',
        delivery_date: '',
        sendFile: '',
        index: '',
        uom: '',
        search: '',
        download: '',
        send: '',
        disabledBtnSend: true,
        firstLoad: true,
        isLoading: true,
        dwnLoading: false,
        uploadLoading: false,
        btnLoading: false,
        btnDisable: false,
        dialog: false,
        dialogPacker: false,
        item: null,
        warehouse: [],
        packer: [],
        helper: [],
        packings: [],
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
        status: [],
      }
    },

    created() {
      this.renderData()
    },

    methods: {
      savePacker() {
        this.dialogblock = true
        this.dialogPacker = true
        this.firstLoad = true
        this.btnDisable = true
        this.btnLoading = true
        this.$http
          .put('/packing/' + this.idItem + '/items-assign', {
            helper: this.packerName,
          })
          .then((response) => {
            this.dialogPacker = false
            let self = this
            setTimeout(function() {
              self.renderData()
              self.firstLoad = false
              self.dialogOverlay = false
              self.$toast.success('Assign Packer Success')
              self.renderData()
            }, 1000)
          })
          .catch((error) => {
            this.firstLoad = false
            this.dialogPacker = false
            this.dialogblock = false
            this.dialogPacker = false
          })
      }, //CLOSE savePacker

      addPacker(val) {
        let arr = []
        if (val) {
          this.helper = val
          for (let i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
          this.packerName = arr
        }
      },

      openDialogDwn() {
        this.dialogblock = true
        this.overlay = true
        this.DownloadFile()
      },

      openDialogUpload() {
        this.dialogblock = true
        this.overlay = true
        this.kirimfiledata()
      },

      openDialog(id, item_name, packer) {
        this.dialogPacker = true
        this.idItem = id
        this.itemName = item_name
        this.packerName = packer
      },
      opendialogPacker() {
        this.dialogOverlay = true
        this.overlay = true
        this.savePacker()
      },

      // DOWNLOAD FILE FROM
      DownloadFile() {
        this.dwnLoading = true
        this.$http
          .get('/packing/' + this.$route.params.id + '/template?export=1')

          .then((response) => {
            window.location.href = response.data.file
            this.dwnLoading = false
            this.dialogblock = false
          })

          .catch((error) => {
            this.dwnLoading = false
            this.dialogblock = false
          })
      },

      // BAGIAN UPLOAD FILE XLXS TO JSON
      handleSelectedFile(convertedData) {
        let that = this
        let data = []
        convertedData.body.forEach((item) => {
          data.push({
            packing_item_id: item.Packing_Item_Id,
            total_pack: parseFloat(item.Total_Pack),
            total_kg: parseFloat(item.Total_Kg),
            helper_id: item.Packer_Id,
          })
        })
        this.sendFile = { packings: data }
        if (this.sendFile) {
          this.disabledBtnSend = false
        }
      }, // CLOSE handleSelectedFile

      kirimfiledata() {
        this.uploadLoading = true
        this.dialogblock = true
        this.$http
          .put('/packing/' + this.$route.params.id, this.sendFile)
          .then((response) => {
            this.uploadLoading = false
            this.dialogblock = false
            this.$toast.success('Data has been uploaded successfully')
            window.location.reload()
          })
      },

      renderData() {
        this.dialogblock = true
        this.firstLoad = true
        this.isLoading = true
        this.$http
          .get('/packing/' + this.$route.params.id)

          .then((response) => {
            this.dialogblock = false
            this.firstLoad = false
            this.isLoading = false
            this.status = response.data.data
            this.warehouse_name = response.data.data.warehouse.warehouse_name
            this.warehouse = response.data.data.warehouse.id
            this.packing_code = response.data.data.document_code
            this.data = response.data.data.packing_items
            this.status = response.data.data.status
            this.delivery_date = response.data.data.delivery_date
            this.$http
              .get('/helper', {
                params: {
                  conditions:
                    'user_id.is_active:1|warehouse_id.e:' + this.warehouse,
                },
              })

              .then((response) => {
                this.packer = response.data.data

                if (this.packer === null) {
                  this.packer = []
                }
              })
              .catch((error) => {
                console.log(error)
              })
            setTimeout(() => {
              if (this.firstLoad) this.firstLoad = false
              this.isLoading = false
            }, 1000)
          })
      }, // CLOSE RENDER DATA

      save() {
        this.$http
          .get('/v1/packing/' + this.$route.params.id)

          .then((response) => {
            this.$router.push('/packing-order')
            this.$toast.success('Data has been saved successfully')
          })
          .catch((error) => {
            this.error = error.response.data.errors
          })
      },
    }, // CLOSE METHODS
  }
</script>

<style scoped>
  .xlsx-button {
    border-radius: 30%;
    width: 200px;
  }
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
  .search2 {
    margin-top: 150px;
    margin-right: 150px;
    box-sizing: content-box;
    width: 150px;
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
