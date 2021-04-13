<template>
  <div>
    <v-autocomplete
      v-model="warehouse"
      label="Warehouse"
      single-line
      outlined
      :items="items"
      item-text="name"
      item-value="value"
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
      :disabled="disabled"
      style="border-radius: 12px"
      clearable
    >
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'SelectFormWarehouseArea',
    data() {
      return {
        search: null,
        warehouse: null,
        items: [],
        warehouseFilter: null,
      }
    },
    props: ['clear', 'warehouse', 'disabled', 'areaId'],
    created() {
      this.renderData('', this.areaId)
    },
    mounted() {
      this.renderData('', this.areaId)
    },
    watch: {
      search: {
        handler: function(val) {
          this.renderData(val)
        },
        deep: true,
      },
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
          areaId =
            'is_archived:0|city_id.e:' +
            areaId +
            '|warehouse_name.icontains:' +
            search
        } else {
          areaId = 'is_archived:0|warehouse_name.icontains:' + search
        }

        this.$http
          .get('/warehouse', {
            params: {
              perpage: 10,
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
