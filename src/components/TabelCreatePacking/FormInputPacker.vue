<template>
  <v-autocomplete
    v-model="values"
    :items="packer"
    outlined
    dense
    height="50px"
    chips
    small-chips
    multiple
    item-text="code"
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
    <template v-slot:label style="padding: 10px"> Packer</template>
  </v-autocomplete>
</template>

<script>
  export default {
    data() {
      return {
        packer: [],
      }
    },

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
                      conditions: 'user_id.is_active:1',
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
