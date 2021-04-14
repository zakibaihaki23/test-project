<template>
  <v-dialog v-model="dialog" persistent max-width="491px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="elevation-0"
        v-bind="attrs"
        v-on="on"
        fab
        @change="selected"
        style="border: 1px solid #3E465B; box-sizing: border-box; border-radius: 5px; width: 35px; height: 23px;"
      >
        <v-icon>
          mdi-dots-horizontal
        </v-icon>
      </v-btn>
    </template>
    <v-card style="border-radius: 20px;width: 491px; height: 500px;">
      <v-card-title>
        <br />
        <br />
        <span style="padding-top:15px; margin-left: 34%; " class="headline"
          >Assign Packer</span
        >
        <v-spacer></v-spacer>
        <v-btn
          style="margin-left:10px; margin-top: 5px; background: #6C757D"
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
              <p style="color: gray; font-size: 20px">
                Item *
              </p>
              <v-text-field
                disabled
                outlined
                single-line
                style="border-radius: 10px"
                v-model="item"
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
                v-model="uom"
                required
                append-icon=""
              ></v-text-field>
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
</template>

<script>
  export default {
    name: 'AssignPacker',
    data() {
      return {
        dialog: false,
        data: [],
      }
    },
    methods: {
      renderData() {
        this.$http
          .get('/packing/' + this.$route.params.id)

          .then((response) => {
            this.packing_code = response.data.data.document_code
            this.data = response.data.data.packing_items
          })
        console.log(this.data)
      },
      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>

<style scoped>
  .v-btn:not(.v-btn--round).v-size--default {
    position: absolute;
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
</style>
