<template>
  <!-- <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }"> -->
        <v-autocomplete
          v-bind="attrs"
          v-on="on"
          v-model="warehouses"
          label="Warehouse"
          style="border-radius: 10px; width: 250px; font-size: 13px"
          outlined
          single-line
          :items="items"
          item-text="name"
          item-value="value"
          name="warehouse"
          hide-selected
          return-object
          :search-input.sync="search"
          @change="selected"
          clearable
          :disabled="disabled"
          append-icon=""
          dense
        >
        </v-autocomplete>
      <!-- </template>
      <span>Select Warehouse</span>
    </v-tooltip>
  </div> -->
</template>

<script>
  export default {
    name: 'SelectFormWarehouseArea',
    data() {
      return {
        search: null,
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
    },
    watch: {
      search: {
        handler: function(val) {
          this.renderData(val)
        },
        deep: true,
      },
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
          areaId = 'city_id.e:' + areaId + '|is_archived:0'
        } else {
          areaId = 'is_archived:0'
        }

        this.$http
          .get('/warehouse', {
            params: {
              perpage: 10,
              conditions: areaId + '|warehouse_name.icontains:' + search,
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
