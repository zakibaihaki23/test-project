<template v-if="authenticated">
  <div>
    <v-app-bar class="appbar" color="white" flat>
      <v-app-bar-nav-icon @click="toggleDrawer()" />

      <v-spacer />

      <v-list style="margin-right: 10px">
        <v-list-item-title style="font-weight: bold; text-transform: uppercase">
          {{ user.email }}
        </v-list-item-title>
        <v-list-item-title style="text-align: right">
          {{ user.usergroup.usergroup_name }}
        </v-list-item-title>
      </v-list>
      <v-badge
        bordered
        color="green"
        content="1"
        dot
        offset-x="30"
        offset-y="7"
        class="d-none d-sm-none d-sm-flex"
      >
        <v-avatar
          style="margin-left: 20px; margin-right: 20px"
          color="grey"
          size="40"
          class="d-none d-sm-none d-sm-flex"
        >
          <v-img src="@/assets/Profile.png" size="40"></v-img>
        </v-avatar>
      </v-badge>
      <v-list class="d-none d-sm-none d-sm-flex">
        <v-list-item-title
          v-for="akun in accounts"
          :key="akun.path"
          :to="akun.path"
          link
          style="cursor: pointer"
          @click="logout"
        >
          <v-icon left style="margin-left: 15px; color: grey"
            >mdi-logout</v-icon
          >
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-title>
      </v-list>

      <v-menu
        :close-on-content-click="true"
        left
        min-width="400"
        offset-y
        transition="slide-x-transition"
      >
      </v-menu>

      <v-menu left offset-y transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            class="d-sm-none d-md-none d-lg-none d-xl-none"
          >
            <v-badge
              bordered
              color="green"
              content="6"
              dot
              offset-x="9"
              offset-y="8"
            >
              <v-avatar color="grey" size="40">
                <v-img src="@/assets/Profile.png" size="40"></v-img>
              </v-avatar>
            </v-badge>
          </v-btn>
        </template>

        <v-list dense min-width="48" nav width="140">
          <template v-for="akun in accounts">
            <v-divider v-if="akun.divider" :key="akun.name" link />

            <v-list-item
              v-for="akun in accounts"
              :key="akun.path"
              :to="akun.path"
              link
              style="cursor: pointer"
              @click="logout"
            >
              <v-list-item>
                <v-icon size="20">
                  {{ akun.icon }}
                </v-icon>
                <v-list-item-title style="margin-left: 18px;font-size: 14px">{{
                  'Logout'
                }}</v-list-item-title>
              </v-list-item>

              <!-- <v-list-item-content>
                <v-list-item-title>{{ 'Logout' }}</v-list-item-title>
              </v-list-item-content> -->
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      enable-resize-watcher
      v-model="drawer.display"
      class="elevation-1"
      app
      color="#3e465b"
      height="100%"
      :dark="false"
    >
      <v-list>
        <v-list-item>
          <v-img
            style="padding: 1px; margin-top: 10px"
            src="@/assets/Logo-Eden.png"
          ></v-img>
        </v-list-item>
      </v-list>

      <v-list class="nav">
        <v-list-item-group v-for="items in drawer.data" :key="items.path">
          <v-list-item
            v-if="items.children.length <= 1"
            :to="`${items.path}/${items.children[0].path}`"
          >
            <v-list-item-icon>
              <v-icon style="color: white; padding-left: 20px;">
                {{ items.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text" style="color: white;">{{
                items.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-group :value="false" no-action>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon style="color: white; padding-left: 20px"
                >mdi-script</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="color: white;"
                >Report</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item v-for="(item, i) in items" :key="i" :to="item.path" link>
            <v-list-item-content>
              <v-list-item-title style="color: white; padding-right: 40px">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      drawer: {
        display: null,
        data: [],
      },
      accounts: [
        {
          icon: 'mdi-logout',
          name: 'Logout',
          path: '/',
        },
      ],
      items: [
        {
          name: 'Packing Order',
          path: '/report/packing',
        },
      ],
    }),
    methods: {
      toggleDrawer() {
        this.drawer.display = !this.drawer.display
      },
      getRoutes() {
        this.$router.options.routes.forEach((route) => {
          this.drawer.data.push(route)
        })
      },
      ...mapActions({
        signOutAction: 'auth/signIn',
      }),
      logout() {
        window.localStorage.clear()
        location.reload()
      },
    },

    created() {
      this.getRoutes()
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        user: 'auth/user',
      }),
    },
  }
</script>

<style scoped>
  .h-sticky {
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .elevation-1 {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  /* .v-list-item.v-list-item:active {
    
  } */

  /* .list-item: {
    color: yellow;
  } */
  .nav .v-list-item-group .v-list-item--active {
    background-color: #323849;
  }
  .v-list-group__items--active {
    background-color: #323849;
  }
  /* .v-list-item--active {
    background-color: #323849;
  } */
</style>
