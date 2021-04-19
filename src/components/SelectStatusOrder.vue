<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-autocomplete
          v-bind="attrs"
          v-on="on"
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
      </template>
      <span>Select Status</span>
    </v-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'SelectStatus',
    data() {
      return {
        status: [
          {
            text: 'Active',
            value: 1,
          },
          {
            text: 'Finished',
            value: 2,
          },
          {
            text: 'Cancelled',
            value: 3,
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
