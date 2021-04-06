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

      <!-- BAGIAN BAWAH -->
      <v-col md="12">
        <p>Note <span style="color: red"></span></p>
        <v-textarea 
        outlined label="Note" 
        style="border-radius: 12px"
        v-model="packing.note" 
        solo> </v-textarea>
      </v-col>
    </v-row>

    <br />
    <br />
    <br />

    

    <!-- BAGIAN FOOTER -->
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

  export default {
    // components: { SelectFormArea, SelectFormWarehouseArea, FormInputPacker },

    data() {
      return {
        
        packing: {
          area: '',
          warehouse_id: '',
          note: '',
          total_order: '',
          date: '',
          dataTable: '',
          code:'',
        },

      }
    },

    created() {
      this.renderData()
    },

    

    
    methods: {
      //untuk mendapatkan data dari API ke dalam format text-field
      renderData() {
        this.$http
          .get('/packing/' + this.$route.params.id,)

          .then((response) => {
            this.packing.note = response.data.data.note
            this.packing.code = response.data.data.document_code
            this.packing.area = response.data.data.area.city_name
            this.packing.date = this.$moment(response.data.data.delivery_date).format('DD/MM/YYYY ')
            this.packing.warehouse_id = response.data.data.warehouse.id
            this.packing.warehouse = response.data.data.warehouse.warehouse_name
          })
      },
      //menyimpan data update ke dalam API
      save() {
        this.$http
          .post('/packing', {
            note: this.packing.note,
          })

          .then((response) => {
            this.$router.push('/packing-order')
            this.$toast.success('Data has been saved successfully')
          })
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
    padding-left: 1100px;
  }
</style>
