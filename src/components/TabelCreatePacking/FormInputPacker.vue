<template>
<v-container fluid>
  <v-row
    align="center"
  >
  <v-autocomplete
    v-model="values"
    :items="packer"
    outlined
    dense
    height="50px"
    chips
    small-chips
    multiple
    item-text="name"
    single-line
    item-value="id"
    @change="selected"
    clearable
    style="
          margin-top:25px;
          border-radius:10px;
          "
  >
    <template slot="item" slot-scope="data">
      {{ data.item.code }} - {{ data.item.name }}
    </template>
    <template v-slot:selection="{ item }">
            <v-chip color="primary" text-color="white">{{item.name}}</v-chip>
        </template>
    <template v-slot:label style="padding: 10px"> Packer</template>
  </v-autocomplete>
    </v-row>
    </v-container>
</template>

<script>
  export default {
    data() {
      return {
        packer: [],
      }
    },
      props: ['warehouse_id'],
    created() {
      this.renderData()
      //   this.initialize(0)
    },
    watch: {
      clear: {
        handler: function(val) {
          this.renderData('')
        },
        deep: true,
      },
    },
    methods: {
      // initialize(){
      //     that.packer=[that.packer]
      // },
      renderData() {
        this.$http
          .get('/helper',
              {
                  params: {
                      conditions: 'user_id.is_active:1|warehouse_id.e:'+this.warehouse_id,
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
      },
      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>
