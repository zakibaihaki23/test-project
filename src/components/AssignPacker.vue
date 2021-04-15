<template>
  <div>
    <v-autocomplete
      outlined
      :items="packer"
      single-line
      style="border-radius: 10px"
      required
      chips
      color="blue-grey lighten-2"
      item-text="name"
      item-value="id"
      @change="selected"
      v-model="packerName"
      append-icon=""
      multiple
    >
      <template slot="item" slot-scope="data">
        {{ data.item.code }} - {{ data.item.name }}
      </template>
      <template v-slot:selection="{ item }">
        <v-chip color="primary" text-color="white">{{ item.name }}</v-chip>
      </template>
      <template v-slot:label style="padding: 10px"> Packer</template>
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        packer: [],
      }
    },
    created() {
      this.renderData()
    },
    methods: {
      renderData() {
        this.$http
          .get('/helper', {
            params: {
              conditions: 'user_id.is_active:1',
            },
          })

          .then((response) => {
            this.packer = response.data.data

            if (this.packer === null) {
              this.packer = []
              console.log(this.packer)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
    },
  }
</script>
