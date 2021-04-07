<template>
  <div>
    <v-autocomplete
      v-model="statusSelected"
      style="border-radius: 10px; width: 250px;font-size: 13px"
      outlined
      label="Status"
      single-line
      :items="status"
      item-text="text"
      item-value="value"
      clearable
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
      dense
    >
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'SelectStatus',
    data() {
      return {
        status: [
          {
            text: 'Inactive',
            value: 0,
          },
          {
            text: 'Active',
            value: 1,
          },
        ],
        statusSelected: null,
        search: null,
      }
    },
    props: ['clear'],
    watch: {
      clear: {
        handler: function(val) {
          this.renderData('')
        },
        deep: true,
      },
    },
    methods: {
      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>
