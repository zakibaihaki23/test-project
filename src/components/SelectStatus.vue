<template>
  <div>
    <v-autocomplete
      v-model="statusSelected"
      style="border-radius: 15px; width: 250px"
      outlined
      label="Status"
      solo
      :items="status"
      item-text="text"
      item-value="value"
      clearable
      hide-no-data
      hide-selected
      return-object
      :search-input.sync="search"
      @change="selected"
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
            text: 'Archive',
            value: 0,
          },
          {
            text: 'Unarchive',
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
