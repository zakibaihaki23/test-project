<template>
  <div>
    <v-autocomplete
      v-model="warehouses"
      label="Warehouse"
      style="border-radius: 15px; width: 250px"
      outlined
      solo
      :items="items"
      item-text="name"
      item-value="value"
      name="warehouse"
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
      clearable
      :disabled="disabled"
      append-icon=""
    >
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'SelectFormWarehouseArea',
    data() {
      return {
        search: '',
        warehouses: null,
        items: [],
      }
    },
    props: ['clear', 'warehouse', 'disabled', 'areaId'],
    created() {
      this.renderData('', this.areaId)
    },
    mounted() {
      this.renderData('', this.areaId)
      console.log(this.clear)
    },
    watch: {
      warehouse: {
        handler: function(val) {
          if (val == null) {
            this.warehouses = null
          }
        },
      },
      clear: {
        handler: function(val) {
          this.warehouse = null
          this.renderData('')
        },
        deep: true,
      },
      areaId: {
        handler: function(val) {
          if (val) {
            this.warehouse = null
            this.renderData('', val)
          }
        },
      },
    },
    methods: {
      renderData(search, areaId) {
        if (areaId) {
          areaId = 'city_id.e:' + areaId
        } else {
          areaId = ''
        }

        this.$http
          .get('/warehouse', {
            params: {
              conditions: areaId,
            },
          })
          .then((response) => {
            this.items = response.data.data

            this.items = []
            let array = response.data.data
            if (array != null) {
              for (let i = 0; i < array.length; i++) {
                this.items.push({
                  name: array[i].warehouse_name,
                  value: array[i].id,
                })
              }
            }
          })
      },

      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>
