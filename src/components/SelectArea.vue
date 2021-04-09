<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-autocomplete
          v-bind="attrs"
          v-on="on"
          v-model="areaSelected"
          style="border-radius: 10px; width: 250px;font-size: 13px"
          outlined
          label="Area"
          single-line
          dense
          :items="area"
          item-text="name"
          item-value="value"
          hide-no-data
          hide-selected
          return-object
          :search-input.sync="search"
          @change="selected"
          clearable
        >
        </v-autocomplete>
      </template>
      <span>Select Area</span>
    </v-tooltip>
  </div>
</template>

//
<script>
  export default {
    name: 'SelectArea',
    data() {
      return {
        search: null,
        area: '',
        areaSelected: null,
      }
    },
    props: ['clear'],
    created() {
      this.renderData()
    },
    mounted() {
      this.renderData('', this.areaId)
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
      renderData() {
        this.$http.get('/city').then((response) => {
          this.area = response.data.data

          this.area = []
          let array = response.data.data
          for (let i = 0; i < array.length; i++) {
            this.area.push({
              name: array[i].city_name,
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
