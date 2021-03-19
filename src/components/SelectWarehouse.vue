<template>
  <div>
    <v-autocomplete
      v-model="warehouseFilter"
      style="border-radius: 15px; width: 250px"
      outlined
      label="Warehouse"
      solo
      :items="warehouse"
      item-text="name"
      item-value="value"
      clearable
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
    >
      <!-- <template slot="selection" slot-scope="data">
        {{ data.item.name }}
      </template>
      <template slot="item" slot-scope="data">
        {{ data.item.name }}
      </template> -->
    </v-autocomplete>
    <!-- <pre>
        {{ warehouse }}
    </pre> -->
  </div>
</template>

//
<script>
  export default {
    name: 'SelectWarehouse',
    data() {
      return {
        search: null,
        warehouse: null,
        warehouseFilter: null,
      }
    },
    props: ['clear'],
    created() {
      this.renderData()
    },
    mounted() {
      this.renderData()
    },
    watch: {
      // warehouse: {
      //   handler: function(val) {
      //     if (val && val.length == 0) {
      //       this.renderData()
      //     }
      //   },
      // },
      clear: {
        handler: function(val) {
          this.renderData('')
        },
        deep: true,
      },
    },
    methods: {
      renderData() {
        this.$http.get('/v1/warehouse').then((response) => {
          this.warehouse = response.data.data

          this.warehouse = []
          let array = response.data.data
          for (let i = 0; i < array.length; i++) {
            this.warehouse.push({
              name: array[i].warehouse_name,
              value: array[i].id,
            })
          }
        })
      },
      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>
