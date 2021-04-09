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

            <v-card style="border-radius:20px;width: 430px; height: 500px">
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

                        <!-- TOMBOL PILIH FILE UNTUK UPLOAD -->
                        <v-col cols="5">
                          <v-btn
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
                          />
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

                <br />
                <br />
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
  import axios from 'axios'

  export default {
    components: { SelectWarehouse, SelectArea },
    data() {
      return {
        defaultButtonText: 'Choose File',
        selectedFile: null,
        isSelecting: false,
        download: '',
        dialog: false,
        item: '',
        uom: '',
        search: '',
        file: 0,
        packing_code: '',
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
        ],
        data: [],
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
      renderData() {
        this.$http
          .get('/packing/' + this.$route.params.id)

          .then((response) => {
            this.packing_code = response.data.data.document_code
            this.data = response.data.data.packing_items
          })
      },

      // Ambil Link Dari Postman
      DownloadFile() {
        this.$http
          .get('/packing/' + this.$route.params.id + '/template?export=1')

          .then((response) => {
            window.open(response.data.file)
            console.log(response.data.file)
          })
      },

      onButtonClick() {
        this.isSelecting = true
        window.addEventListener(
          'focus',
          () => {
            this.isSelecting = false
          },
          { once: true }
        )

        this.$refs.uploader.click()
      },

      onFileChanged(e) {
        this.selectedFile = e.target.files[0]

        console.log(this.selectedFile)

        // do something
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
