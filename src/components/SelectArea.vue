<template>
  <div>
    <v-select
      v-model="areaSelected"
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
    </v-select>
  </div>
</template>

<script>
  export default {
    name: 'SelectArea',
    data() {
      return {
        area: null,
        areaSelected: null,
        search: null,
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
