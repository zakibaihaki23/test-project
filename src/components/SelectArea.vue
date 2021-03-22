<template>
  <div>
    <v-autocomplete
      v-model="areaSelected"
      style="border-radius: 15px; width: 250px"
      outlined
      label="Area"
      solo
      :items="area"
      item-text="name"
      item-value="value"
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
    >
    </v-autocomplete>
  </div>
</template>

//
<script>
  export default {
    name: 'SelectArea',
    data() {
      return {
        search: null,
        area: null,
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
        this.$http.get('/v1/city').then((response) => {
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
