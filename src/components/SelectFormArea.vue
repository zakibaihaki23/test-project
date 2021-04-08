<template>
  <div>
    <v-select
      v-model="areaSelected"
      label="Area"
      single-line
      outlined
      :items="area"
      item-text="city_name"
      item-value="id"
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
      style="border-radius: 12px"
    >
    </v-select>
  </div>
</template>

<script>
  export default {
    name: 'SelectFormArea',
    data() {
      return {
        area: [],
        areaSelected: null,
        search: '',
      }
    },
    props: ['clear', 'city'],
    mounted() {
      this.renderData('', true)
    },
    watch: {
      search: {
        handler: function(val) {
          if (val && val.length == 1) {
            this.renderData(val)
          }
        },
        deep: true,
      },
      clear: {
        handler: function(val) {
          this.areaSelected = null
        },
        deep: true,
      },
      city: {
        handler: function(val) {
          if (val) {
            this.autoSelectById(val)
          }
        },
        deep: true,
      },
    },
    methods: {
      renderData(search) {
        this.$http
          .get('/city', {
            // params: {
            //   conditions: 'city_name.icontains:' + search,
            // },
          })
          .then((response) => {
            this.area = response.data.data
            if (this.area === null) {
              this.area = []
            }
          })
      },
      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>
