<template>
  <div>
    <v-select
      v-model="warehouse"
      label="Warehouse"
      single-line
      outlined
      :items="items"
      item-text="name"
      item-value="value"
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
      :disabled="disabled"
      style="border-radius: 12px"
    >
    </v-select>
  </div>
</template>

<script>
  export default {
    name: 'SelectFormWarehouseArea',
    data() {
      return {
        search: '',
        warehouse: null,
        items: [],
        warehouseFilter: null,
      }
    },
    props: ['clear', 'warehouse', 'disabled', 'areaId'],

    mounted() {
      this.renderData('', this.areaId)
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
          this.renderData()
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
          areaId = 'is_archived:0|city_id.e:' + areaId
        } else {
          areaId = ''
        }

        this.$http
          .get('/warehouse', {
            params: {
              embeds: 'city',
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
