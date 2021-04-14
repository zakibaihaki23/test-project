<template>
  <div>
    <v-autocomplete
      outlined
      single-line
      :search-input.sync="search"
      style="border-radius: 10px"
      item-text="item_name"
      item-value="value"
      v-model="item_list"
      :items="items"
      required
      @change="selected"
      append-icon=""
      clearable
      return-object
    >
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'AddPackableItem',
    data() {
      return {
        search: null,
        item_list: null,
        items: [],
      }
    },
    props: ['clear', 'item'],

    mounted() {
      this.renderData('')
    },
    watch: {
      search: {
        handler: function(val) {
          if (val) {
            this.renderData(val)
          }
        },
        deep: true,
      },
      clear: {
        handler: function(val) {
          this.renderData('')
          if (val == true) {
            this.item_list = ''
          }
        },
        deep: true,
      },
    },
    methods: {
      renderData(search) {
        // GET PACKABLE WHEN 0
        this.$http
          .get('/inventory/item', {
            params: {
              embeds: 'item_uom_id',
              perpage: 10,
              page: '1',
              conditions: 'packable:0' + '|item_name.icontains:' + search,
            },
          })
          .then((response) => {
            this.items = []

            let array = response.data.data

            for (let i = 0; i < array.length; i++) {
              this.items.push({
                item_name: array[i].item_name,
                value: array[i].id,
                uom: array[i].item_uom.item_uom_name,
                uom_id: array[i].item_uom.id,
              })
              // this.itemSelected(response.data.data)
            }
          })
      },
      selected(event) {
        this.$emit('selected', event)
      },
    },
  }
</script>
