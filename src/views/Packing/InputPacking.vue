<template>
  <div class="helper">
    <h2>INPUT PACKING</h2>
    <v-container>
      <v-row>

        <v-col class="btndownload" cols="12" md="4">
            <v-btn 
            :to="{ path: '/packing/create-packing' }"
            style="
            width: 200px;
            height: 35px;
            background: #4662d4;
            color: white;
            border-radius: 30px;
            box-sizing: content-box;
            margin-top: 50px;
            text-transform: capitalize;
            cursor: pointer;
            padding: 5px;
            "
            >Download</v-btn
            >

      <!-- V-DIALOG BUAT TOMBOL UPLOAD MASUK KE DIALOG -->
      <v-dialog
       v-model="dialog"
       persistent
       max-width="430px"
      >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          style="
          width: 200px;
            height: 35px;
            background: #4662d4;
            color: white;
            border-radius: 30px;
            box-sizing: content-box;
            margin-top: 50px;
            margin-left: 10px;
            text-transform: capitalize;
            cursor: pointer;
            padding: 5px;
          "
        >
          Upload
        </v-btn>
      </template>

      
      <v-card 
      style="border-radius:25px;">
        <v-card-title>
          <br>
          <br>
          <span 
          style="padding-top:15px; "
          class="headline">Upload File</span>
          <v-spacer></v-spacer>
          <v-btn style="margin-left:10px; margin-top: 5px;"
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
          <v-container v-if="this.file<=0">
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
              
              <br>
              <v-col>
              <v-icon style=
              "margin-left:107px;
              font-size:45px"
              > mdi-file</v-icon>
              </v-col>

              <v-col
                cols="5"
                >
                <v-btn
                depressed
                :loading="isSelecting"
                @click="onButtonClick"
                style=
                "margin-left:24px;
                 width: 200px;
                 height: 35px;
                 background: #4662d4;
                 color: white;
                 border-radius: 30px;
                 box-sizing: content-box;
                 text-transform: capitalize;
                 cursor: pointer;
                 padding: 5px;
                "
                >
                
                choose file</v-btn>
                <input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  accept="image/*"
                  @change="onFileChanged"
                >
                </v-col>
              <v-col>
                <span style="margin-left:121px;"
                >Or</span></v-col>
              <v-col>
                <span style="margin-left:85px;"
                >Drop File Here</span></v-col>
              </div>
            </div>
            </v-row>
            <br>
          </v-container>



          <!-- CONTAINER KE-2 -->
          <v-container v-if="this.file>0">
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
              
              <br>
              <v-col>
              <v-icon style=
              "margin-left:107px;
              font-size:45px"
              > mdi-file</v-icon>
              </v-col>

              <v-col
                cols="5"
                >
                <v-btn style=
                "margin-left:24px;
                 width: 200px;
                 height: 35px;
                 background: #4662d4;
                 color: white;
                 border-radius: 30px;
                 box-sizing: content-box;
                 text-transform: capitalize;
                 cursor: pointer;
                 padding: 5px;
                "
                >choose file</v-btn></v-col>
              <v-col>
                <span style="margin-left:121px;"
                >Or</span></v-col>
              <v-col>
                <span style="margin-left:85px;"
                >Drop File Here</span></v-col>
              </div>
            </div>
            </v-row>
            <br>
          </v-container>
           <v-btn
            style=
            "margin-left:35px;
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
          <br>
          <br>
        </v-card-text>
      </v-card>
    </v-dialog>
        </v-col>
        
        <v-spacer></v-spacer>
        
        <v-col cols="12" md="7">
          <v-row style="margin-top:30px;">
          <v-col cols="6" md="11">
            <div 
            class="search"
            style="padding-left:400px;">
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
          <v-col cols="1" md="1">
            <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn style="margin-left:10px; margin-top: 5px;"
                color="primary"
                fab
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                mdi-format-align-justify
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index" 
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
        :to="{ path: '/packing' }"
        color="#E6E9ED"
        style="margin: 10px; color: #768F9C; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
        class="cancel"
        link
        >Cancel</v-btn
      >
      <v-btn
        style="margin: 10px; background: #4662d4; color: white; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
        class="save"
        @click="save"
        >Save</v-btn
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
        file:0,
        headers: [
          // {
          //   text: 'No.',
          //   value: 'no',
          //   sortable: false,
          // },
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


      // FUNGSI UPLOAD
      onButtonClick() {
        this.isSelecting = true;
        window.addEventListener(
        "focus",
          () => {
            this.isSelecting = false;
            },
          { once: true }
          );

          this.$refs.uploader.click();
        },
      onFileChanged(e) {
        this.selectedFile = e.target.files[0];
        }
  
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
   .btn {
    margin-top: 30px;
    padding-left: 1100px;
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
