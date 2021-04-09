<template>
  <div class="regist">
    <h1>UPDATE PACKING</h1>

    <!-- BAGIAN KIRI -->
    <v-row no-gutters>
      <v-col md="6">
        <div class="form-right">
          <!-- PACKING ORDER CODE -->
          <p style="color: gray">Packing Order Code *</p>
          <v-text-field
            v-model="packing.code"
            disabled
            outlined
            single-line
            class="form"
            label="Packing Order Code"
            style="border-radius: 12px;"
          >
          </v-text-field>

          <!-- AREA -->
          <p style="color: gray">Area *</p>
          <v-text-field
            v-model="packing.area"
            disabled
            outlined
            single-line
            class="form"
            label="Area"
            style="border-radius: 12px;"
          >
          </v-text-field>
        </div>
      </v-col>

      <!-- BAGIAN KANAN -->
      <v-col md="6">
        <div class="form-right">
          <!-- DELIVERY DATE -->
          <p style="color: gray">Delivery Date *</p>
          <v-text-field
            v-model="packing.date"
            disabled
            outlined
            single-line
            class="form"
            label="Delivery Date"
            style="border-radius: 12px;"
            prepend-inner-icon="mdi-calendar"
          >
          </v-text-field>

          <!-- BAGIAN Warehouse -->
          <p style="color: gray">Warehouse *</p>
          <v-text-field
            v-model="packing.warehouse"
            disabled
            outlined
            single-line
            class="form"
            label="Warehouse"
            style="border-radius: 12px;"
          >
          </v-text-field>
          <!-- {{this.packing.warehouse_id}} -->
        </div>
      </v-col>

      <!-- BAGIAN PANJANG -->
      <v-col md="12">
        <p>Note <span style="color: red"></span></p>
        <v-textarea
          outlined
          label="Note"
          style="border-radius: 12px"
          v-model="packing.note"
          single-line
        >
        </v-textarea>
      </v-col>
    </v-row>

    <br />
    <br />
    <br />

    <!-- BAGIAN TABEL -->
    <div>
      <v-data-table
        loading-text="Please Wait...."
        :headers="table"
        :items="dataTable"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :search="search"
        @page-count="pageCount = $event"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              {{ props.item.item.item_name }}
            </td>
            <td>
              {{ props.item.item.item_uom.item_uom_name }}
            </td>

            <td>
              {{ props.item.total_order }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <!-- BAGIAN FOOTER -->
    <br /><br />
    <br />
    <v-divider></v-divider>
    <div class="btn">
      <v-row>
        <v-col md="10" sm="9" cols="5" lg="10" class="text-right">
          <v-btn
            :to="{ path: '/packing-order' }"
            color="#E6E9ED"
            style="margin: 10px; color: #768F9C; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
            class="cancel"
            link
            >Cancel</v-btn
          >
        </v-col>
        <v-col md="1" sm="2" cols="5" lg="1" class="text-right">
          <v-btn
            style="margin: 10px; background: #4662d4; color: white; box-sizing: content-box; border-radius: 25px; width: 111px; height: 45px; padding: 4px"
            class="save"
            @click="save"
            :disabled="disable"
            >Save</v-btn
          >
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import FormInputPacker from '../../components/TabelCreatePacking/FormInputPacker'
  export default {
    components: { FormInputPacker },

    data() {
      return {
        disable: true,
        packing: {
          area: '',
          warehouse_id: '',
          note: '',
          total_order: '',
          date: '',
          packer: '',
          dataTable: [],
          idx: '',
          code: '',
          items: [],
        },

        table: [
          {
            text: 'Item',
            align: 'left',
            with: '10%',
            class: ' black--text title',
            sortable: false,
          },
          {
            text: 'UOM',
            align: 'left',
            with: '10%',
            class: '  black--text title',
            sortable: false,
          },
          {
            text: 'Total Order',
            align: 'left',
            with: '10%',
            class: '  black--text title',
            sortable: false,
          },
        ],
      }
    },
    created() {
      this.renderData()
    },

    methods: {
      sendIdx(id) {
        this.idx = idx
      },
      //untuk mendapatkan data dari API ke dalam format text-field
      renderData() {
        this.$http
          .get('/packing/' + this.$route.params.id)

          .then((response) => {
            this.packing.note = response.data.data.note
            this.packing.code = response.data.data.document_code
            this.packing.area = response.data.data.area.city_name
            this.packing.date = this.$moment(
              response.data.data.delivery_date
            ).format('DD/MM/YYYY ')
            this.packing.warehouse_id = response.data.data.warehouse.id
            this.packing.warehouse = response.data.data.warehouse.warehouse_name
            this.dataTable = response.data.data.packing_items
          })
      },
      getId(id) {
        console.log(id, '=====')
      },
      //menyimpan data update ke dalam API
      save() {
        var items = []
        for (let i = 0; i < this.dataTable.length; i++) {
          items[i] = {
            item_id: this.dataTable[i].id,
          }
        }
        this.$http
          .put('/packing/' + this.$route.params.id, {
            area_id: this.area,
            warehouse_id: this.warehouse_id,
            note: this.note,
            total_order: parseInt(this.total_order),
            delivery_date: this.date,
            items: this.dataTable,
          })

          .then((response) => {
            this.$router.push('/packing-order')
            this.$toast.success('Data has been saved successfully')
          })
      },
      inputPacker(val) {
        this.dataTable[this.idx].helper_id = []
        if (val) {
          this.dataTable[this.idx].helper_id = val
        }
        console.log(this.dataTable)
      },
    },
  }
</script>

<style scoped>
  .regist {
    padding-left: 80px;
    padding-right: 50px;
  }
  .form-right {
    margin-top: 50px;
    padding-right: 90px;
  }
  .btn {
    margin-top: 30px;
  }
</style>
